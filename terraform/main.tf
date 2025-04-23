provider "aws" {
    region = "eu-north-1"
}

provider "kubernetes" {
    host                   = module.eks.cluster_endpoint
    insecure               = true
    exec {
        api_version = "client.authentication.k8s.io/v1beta1"
        command     = "aws"
        args        = ["eks", "get-token", "--cluster-name", local.cluster_name]
    }
}

provider "helm" {
    kubernetes {
        host                  = module.eks.cluster_endpoint
        insecure               = true

        exec {
            api_version = "client.authentication.k8s.io/v1beta1"
            command     = "aws"
            args        = ["eks", "get-token", "--cluster-name", local.cluster_name]
        }
    }
}

locals {
    cluster_name = "devops-eks"
}

data "aws_vpc" "existing"{
    id = var.vpc_id
}

data "aws_subnets" "public" {
    filter {
      name = "vpc-id"
        values = [var.vpc_id]
    }
    filter {
        name = "map-public-ip-on-launch"
        values = ["true"]
    }
}

module "eks"{
    source = "terraform-aws-modules/eks/aws"
    version = "~> 19.0"

    cluster_name    = local.cluster_name
    cluster_version = "1.31"

    vpc_id     = var.vpc_id
    subnet_ids = data.aws_subnets.public.ids

    cluster_endpoint_public_access  = true
    cluster_endpoint_private_access = true  # Keep private access too for security

    eks_managed_node_groups = {
        main = {
            name = "node-group-1"
            instance_types = ["t3.medium"]
            min_size     = 2
            max_size     = 5
            desired_size = 2
        }
    }
}

module "load_balancer_controller_irsa_role" {
  source = "terraform-aws-modules/iam/aws//modules/iam-role-for-service-accounts-eks"

  role_name                              = "load-balancer-controller"
  attach_load_balancer_controller_policy = true

  oidc_providers = {
    main = {
        provider_arn = module.eks.oidc_provider_arn
        namespace_service_accounts = ["kube-system:aws-load-balancer-controller"]
    }
  }
}

resource "helm_release" "aws_load_balancer_controller" {
    name = "aws-load-balancer-controller"
    repository = "https://aws.github.io/eks-charts"
    chart = "aws-load-balancer-controller"
    namespace = "kube-system"


    set {
        name = "clusterName"
        value = local.cluster_name
    }
    
    set {
        name = "serviceAccount.create"
        value = "true"
    }

    set {
        name = "serviceAccount.annotations.eks\\.amazonaws\\.com/role-arn"
        value = module.load_balancer_controller_irsa_role.iam_role_arn
    }

    depends_on = [ module.eks ]
}

resource "time_sleep" "wait_for_cluster" {
  depends_on = [module.eks]
  create_duration = "180s"
}

resource "kubernetes_deployment" "vue_frontend" {
    depends_on = [ time_sleep.wait_for_cluster] 
  metadata {
    name      = "vue-frontend"
    labels = {
        app = "vue-frontend"
    }
  }

  spec {
    replicas = 2

    selector {
        match_labels = {
            app = "vue-frontend"
        }
    }

    template {
        metadata {
            labels = {
                app = "vue-frontend"
            }
        }

        spec {
            container {
                image  = "${var.ecr_repo_name}:latest"
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

resource "kubernetes_service" "vue_frontend" {
    depends_on = [ time_sleep.wait_for_cluster] 
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

resource "kubernetes_horizontal_pod_autoscaler_v2" "vue_frontend" {
        depends_on = [ time_sleep.wait_for_cluster] 
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
                    path = "/auth/room"
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
                    path = "/auth/create"
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
                    path = "/auth/"
                    path_type = "Exact"
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

    depends_on = [helm_release.aws_load_balancer_controller, time_sleep.wait_for_cluster] 

  
}

resource "aws_ec2_tag" "cluster_tag" {
    for_each = toset(data.aws_subnets.public.ids)
    resource_id = each.value
    key = "kubernetes.io/cluster/${local.cluster_name}"
    value = "shared"
  
}

resource "aws_ec2_tag" "elb_tag" {
    for_each = toset(data.aws_subnets.public.ids)
    resource_id = each.value
    key = "kubernetes.io/role/elb"
    value = "1"
  
}