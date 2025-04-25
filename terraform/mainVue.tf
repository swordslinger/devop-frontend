
# Sets up the connectiong to kubernetes cluster using AWS credentials.
provider "kubernetes" {
    host                   = data.aws_eks_cluster.existing_cluster.endpoint
    insecure               = true
    exec {
        api_version = "client.authentication.k8s.io/v1beta1"
        command     = "aws"
        args        = ["eks", "get-token", "--cluster-name", local.cluster_name]
    }
}

# Looks up information about the existing EKS cluster.
data "aws_eks_cluster" "existing_cluster" {
    name = local.cluster_name
}

# Creates the website application with backup copies
resource "kubernetes_deployment" "vue_frontend" {
  metadata {
    name      = "vue-frontend"
    labels = {
        app = "vue-frontend"
    }
  }

  spec {
    replicas = 2    #Two copies created

    # Indetifier for frontend
    selector {
        match_labels = {
            app = "vue-frontend"
        }
    }

    # indetifier for container
    template {
        metadata {
            labels = {
                app = "vue-frontend"
            }
        }

        # gets container image from ECR configures computing resources.
        spec {
            container {
                image  = "${var.ecr_repo_name}"
                name = "vue-frontend"

                resources {
                    limits = {
                        cpu    = "500m"
                        memory = "256Mi"
                    }
                    requests = {
                        cpu    = "100m"
                        memory = "128Mi"
                    }
                }


                port {
                    container_port = 80
                }

                // Checks the website is respodning
                liveness_probe {
                  http_get {
                    path = "/*"
                    port = 80
                  }
                    initial_delay_seconds = 15
                  period_seconds = 20
                    }
                }
            }
        }
    }
}

// Creates an internal address for the website.
resource "kubernetes_service" "vue_frontend" {
    metadata {
        name = "vue-frontend"
    }

    spec {
        selector = {
            app = "vue-frontend"
        }

        port {
            port        = 80
            target_port = 80
        }

        type = "ClusterIP"
    }
  
}


// Adds more website copies if traffic increases.
resource "kubernetes_horizontal_pod_autoscaler_v2" "vue_frontend" {
    metadata {
        name = "vue-frontend-hpa"
    }
    spec {
        scale_target_ref {
          api_version =  "apps/v1"
          kind      = "Deployment"
          name      = kubernetes_deployment.vue_frontend.metadata[0].name
        }
        min_replicas = 2
        max_replicas = 5
        metric {
            type = "Resource"
            resource {
                name = "cpu"
                target {
                    type = "Utilization"
                    average_utilization = 80
                }
            }
        }
    }
}


// Sets up public access to the website using aws.
resource "kubernetes_ingress_v1" "vue_frontend" {
    metadata {
        name = "vue-frontend-ingress"
        annotations = {
            "kubernetes.io/ingress.class" = "alb"
            "alb.ingress.kubernetes.io/scheme" = "internet-facing"
            "alb.ingress.kubernetes.io/target-type" = "ip"
            "alb.ingress.kubernetes.io/healthcheck-path" = "/"

            "alb.ingress.kubernetes.io/backend-protocol" = "HTTP"
            "alb.ingress.kubernetes.io/target-group-attributes" = "stickiness.enabled=true,stickiness.enabled=true,stickiness.type=lb_cookie,stickiness.lb_cookie.duration_seconds=3600"
            "alb.ingress.kubernetes.io/load-balancer-attributes" = "idle_timeout.timeout_seconds=3600"
        }
    }

    // Sets up the routing from the website to the backend services via different prefixes.
    spec {
        rule {
            http {
                path {
                    path = "/"
                    path_type = "Prefix"

                    backend {
                        service {
                            name = kubernetes_service.vue_frontend.metadata[0].name
                            port {
                                number = 80
                            }
                        }
                    }
                }

                path{
                    path = "/auth/register"
                    path_type = "Prefix"
                    backend {
                        service {
                            name = "register-service"
                            port {
                                number = 80
                            }
                        }
                    }
                }
                path{
                    path = "/auth/login"
                    path_type = "Prefix"
                    backend {
                        service {
                            name = "login-service"
                            port {
                                number = 80
                            }
                        }
                    }
                }
                path{
                    path = "/ws"
                    path_type = "Prefix"
                    backend {
                        service {
                            name = "chat-service"
                            port {
                                number = 80
                            }
                        }
                    }
                }
                path{
                    path = "/chatRoom"
                    path_type = "Prefix"
                    backend {
                        service {
                            name = "chat-service"
                            port {
                                number = 80
                            }
                        }
                    }
                }
            path{
                path = "/message"
                    path_type = "Prefix"
                    backend {
                        service {
                            name = "chat-service"
                            port {
                                number = 80
                            }
                        }
                    }
                }

            }
        }
    }
}

