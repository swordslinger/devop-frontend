// Region where the EKS cluster will be created.
provider "aws" {
    region = "eu-north-1"
}


// Local varible to store the cluster name.
locals {
    cluster_name = "devops-eks"
}

# Get infomation about the existing VPC.
data "aws_vpc" "existing"{
    id = var.vpc_id
}

# Find all public subnets in the VPC.
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

// Create an Amazon EKS cluster
module "eks"{
    source = "terraform-aws-modules/eks/aws" # EKS terraform module
    version = "~> 19.0" # module version

    cluster_name    = local.cluster_name # Name of the EKS cluster
    cluster_version = "1.31" # Kubernetes version.

    vpc_id     = var.vpc_id  # The VPC the cluster will be created in.
    subnet_ids = data.aws_subnets.public.ids # where to place cluster components.

    cluster_endpoint_public_access  = true # Allow access from the internet
    cluster_endpoint_private_access = true  # Allow access from within the VPC

    // Worker nodes configuration.
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


// Create an IAM role for the AWS Load Balancer Controlleer so that kubernetes can use it to manage AWS resources.
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
 

# Tags all public subnets for kubernetes cluster indetication
resource "aws_ec2_tag" "cluster_tag" {
    for_each = toset(data.aws_subnets.public.ids)
    resource_id = each.value
    key = "kubernetes.io/cluster/${local.cluster_name}"
    value = "shared"
  
}

# Tags all public subnets for ELB integration
resource "aws_ec2_tag" "elb_tag" {
    for_each = toset(data.aws_subnets.public.ids)
    resource_id = each.value
    key = "kubernetes.io/role/elb"
    value = "1"
  
}