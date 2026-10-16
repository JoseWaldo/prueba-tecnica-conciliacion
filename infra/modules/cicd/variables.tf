variable "project_name" {
  description = "Nombre del proyecto, usado como prefijo de los recursos"
  type        = string
}

variable "environment" {
  description = "Entorno de despliegue"
  type        = string
}

variable "github_sub" {
  description = "Patrón del claim 'sub' del token OIDC de GitHub autorizado a asumir el rol"
  type        = string
}

variable "lambda_function_arn" {
  description = "ARN de la función Lambda que puede desplegar el pipeline"
  type        = string
}

variable "frontend_bucket_arn" {
  description = "ARN del bucket S3 del frontend que puede desplegar el pipeline"
  type        = string
}

variable "cloudfront_distribution_arn" {
  description = "ARN de la distribución de CloudFront que puede invalidar el pipeline"
  type        = string
}

variable "tags" {
  description = "Etiquetas adicionales para todos los recursos"
  type        = map(string)
  default     = {}
}
