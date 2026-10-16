output "deploy_role_arn" {
  description = "ARN del rol IAM que GitHub Actions asume para desplegar"
  value       = aws_iam_role.deploy.arn
}

output "deploy_role_name" {
  description = "Nombre del rol IAM de despliegue"
  value       = aws_iam_role.deploy.name
}

output "oidc_provider_arn" {
  description = "ARN del proveedor OIDC de GitHub"
  value       = aws_iam_openid_connect_provider.github.arn
}
