provider "aws" {
    region = "eu-north-1"
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