variable "project_name" {
  description = "Nombre del proyecto, usado como prefijo de los recursos"
  type        = string
}

variable "environment" {
  description = "Entorno de despliegue (dev, staging, prod)"
  type        = string
}

variable "lambda_zip_path" {
  description = "Ruta (absoluta) al archivo .zip con el código de la Lambda"
  type        = string
}

variable "lambda_handler" {
  description = "Handler de la función Lambda"
  type        = string
  default     = "lambda_handler.handler"
}

variable "lambda_runtime" {
  description = "Runtime de la función Lambda"
  type        = string
  default     = "python3.12"
}

variable "lambda_architecture" {
  description = "Arquitectura de la función Lambda"
  type        = string
  default     = "x86_64"
}

variable "lambda_memory_size" {
  description = "Memoria (MB) asignada a la Lambda"
  type        = number
  default     = 128
}

variable "lambda_timeout" {
  description = "Timeout (segundos) de la Lambda"
  type        = number
  default     = 30
}

variable "environment_variables" {
  description = "Variables de entorno de la Lambda"
  type        = map(string)
  default     = {}
}

variable "log_retention_in_days" {
  description = "Retención de logs de CloudWatch (días)"
  type        = number
  default     = 30
}

variable "api_description" {
  description = "Descripción de la API Gateway"
  type        = string
  default     = "API de conciliación de facturas y retenciones"
}

variable "cors_allow_origins" {
  description = "Orígenes permitidos para CORS en API Gateway"
  type        = list(string)
  default     = ["*"]
}

variable "cors_allow_methods" {
  description = "Métodos HTTP permitidos para CORS"
  type        = list(string)
  default     = ["GET", "POST", "OPTIONS"]
}

variable "cors_allow_headers" {
  description = "Cabeceras permitidas para CORS"
  type        = list(string)
  default     = ["*"]
}

variable "tags" {
  description = "Etiquetas adicionales para todos los recursos"
  type        = map(string)
  default     = {}
}
