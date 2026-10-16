output "bucket_name" {
  description = "Nombre del bucket S3"
  value       = aws_s3_bucket.site.id
}

output "bucket_arn" {
  description = "ARN del bucket S3"
  value       = aws_s3_bucket.site.arn
}

output "cloudfront_distribution_id" {
  description = "ID de la distribución de CloudFront"
  value       = aws_cloudfront_distribution.site.id
}

output "cloudfront_distribution_arn" {
  description = "ARN de la distribución de CloudFront"
  value       = aws_cloudfront_distribution.site.arn
}

output "cloudfront_domain_name" {
  description = "Dominio de la distribución de CloudFront"
  value       = aws_cloudfront_distribution.site.domain_name
}

output "website_url" {
  description = "URL pública del frontend"
  value       = "https://${aws_cloudfront_distribution.site.domain_name}"
}
