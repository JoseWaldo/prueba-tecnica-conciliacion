module "backend" {
  source = "../../modules/backend"

  project_name    = var.project_name
  environment     = var.environment
  lambda_zip_path = abspath("${path.root}/../../build/lambda.zip")

  environment_variables = {
    FLASK_ENV = "production"
  }

  tags = var.tags
}

module "frontend" {
  source = "../../modules/frontend"

  project_name = var.project_name
  environment  = var.environment
  bucket_name  = var.bucket_name

  tags = var.tags
}

module "cicd" {
  source = "../../modules/cicd"

  project_name = var.project_name
  environment  = var.environment
  github_sub   = var.github_sub

  lambda_function_arn         = module.backend.lambda_function_arn
  frontend_bucket_arn         = module.frontend.bucket_arn
  cloudfront_distribution_arn = module.frontend.cloudfront_distribution_arn

  tags = var.tags
}
