variable "aws_region" {
  description = "Región AWS donde se despliegan los recursos"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Nombre del proyecto, usado como prefijo de los recursos"
  type        = string
  default     = "conciliacion"
}

variable "environment" {
  description = "Entorno de despliegue"
  type        = string
  default     = "prod"
}

variable "bucket_name" {
  description = "Nombre del bucket S3 del frontend (debe ser único globalmente)"
  type        = string
}

variable "github_sub" {
  description = "Claim 'sub' del token OIDC autorizado a desplegar (formato inmutable con IDs de owner/repo)"
  type        = string
  default     = "repo:JoseWaldo@50810738/prueba-tecnica-conciliacion@1421449791:*"
}

variable "tags" {
  description = "Etiquetas adicionales para todos los recursos"
  type        = map(string)
  default     = {}
}
