variable "project_name" {
  description = "Nombre del proyecto, usado como prefijo de los recursos"
  type        = string
}

variable "environment" {
  description = "Entorno de despliegue (dev, staging, prod)"
  type        = string
}

variable "bucket_name" {
  description = "Nombre del bucket S3 (debe ser único globalmente)"
  type        = string
}

variable "price_class" {
  description = "Clase de precio de CloudFront"
  type        = string
  default     = "PriceClass_100"
}

variable "aliases" {
  description = "Dominios alternativos de CloudFront (requiere certificado ACM y dominio propio)"
  type        = list(string)
  default     = []
}

variable "versioning_enabled" {
  description = "Habilita el versionado del bucket S3"
  type        = bool
  default     = false
}

variable "tags" {
  description = "Etiquetas adicionales para todos los recursos"
  type        = map(string)
  default     = {}
}
