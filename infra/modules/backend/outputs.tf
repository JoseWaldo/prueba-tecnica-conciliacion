output "lambda_function_name" {
  description = "Nombre de la función Lambda"
  value       = aws_lambda_function.api.function_name
}

output "lambda_function_arn" {
  description = "ARN de la función Lambda"
  value       = aws_lambda_function.api.arn
}

output "lambda_invoke_arn" {
  description = "ARN de invocación de la Lambda (para permisos)"
  value       = aws_lambda_function.api.invoke_arn
}

output "api_gateway_id" {
  description = "ID de la API Gateway"
  value       = aws_apigatewayv2_api.api.id
}

output "api_endpoint" {
  description = "URL base (HTTPS) de la API desplegada"
  value       = aws_apigatewayv2_stage.default.invoke_url
}
