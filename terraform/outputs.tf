output "cluster_endpoint" {
    description = "Endpoint for the EKS cluster"
    value       = module.eks.cluster_endpoint
}

output "cluster_name" {
    description = "Name of the EKS cluster"
    value       = module.eks.cluster_name
}

output "load_balancer_hostname" {
    description = "Hostname of the load balancer"
    value   = try(kubernetes_ingress_v1.vue_frontend.status.0.load_balancer.0.ingress.0.hostname, "load balancer not available yes")
}

output "oidc_provider_arn" {
    description = "Arn of the oidc provider"
    value   = module.eks.oidc_provider_arn
}

output "load_balancer_role_arn" {
    description = "Arn role of the load balancer"
    value   = module.load_balancer_controller_irsa_role.iam_role_arn
}