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
