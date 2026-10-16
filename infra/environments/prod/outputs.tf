output "backend_api_endpoint" {
  description = "URL de la API (backend)"
  value       = module.backend.api_endpoint
}

output "frontend_website_url" {
  description = "URL del frontend (CloudFront)"
  value       = module.frontend.website_url
}

output "frontend_bucket_name" {
  description = "Bucket S3 del frontend"
  value       = module.frontend.bucket_name
}
