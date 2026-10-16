# Infraestructura (Terraform)

Levantamiento de la infraestructura en AWS con Terraform (desplegada en prod).

- **Backend** → **AWS Lambda** (Flask) + **API Gateway HTTP API**.
- **Frontend** → **S3** (privado) + **CloudFront** con Origin Access Control.
- **CI/CD** → proveedor OIDC de GitHub + rol IAM de despliegue.

## Estructura

```
infra/
├── modules/                    # Módulos reutilizables
│   ├── backend/                # Lambda + API Gateway + IAM + logs
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   └── versions.tf
│   ├── frontend/               # S3 + CloudFront (OAC) + bucket policy
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   └── versions.tf
│   └── cicd/                   # OIDC de GitHub + rol IAM para despliegue
│       ├── main.tf
│       ├── variables.tf
│       ├── outputs.tf
│       └── versions.tf
├── environments/               # Despliegues concretos (uno por entorno)
│   └── prod/
│       ├── main.tf             # Usa los tres módulos con configuración de prod
│       ├── variables.tf
│       ├── outputs.tf
│       ├── versions.tf         # Provider AWS
│       ├── terraform.tfvars.example
│       ├── backend.tf.example  # Estado remoto (S3) opcional
│       └── .env.example        # Plantilla de credenciales AWS (→ .env, ignorado)
├── scripts/
│   ├── package-lambda.py        # Empaqueta la Lambda (cross-platform, usa zipfile)
│   ├── package-lambda.ps1       # Wrapper PowerShell del anterior
│   ├── package-lambda.sh        # Wrapper bash del anterior
│   ├── deploy-frontend.ps1      # Compila y sube el frontend a S3 + invalida CDN
│   ├── deploy-frontend.sh       # Ídem para Linux/CI
│   └── load-env.ps1             # Carga un .env como variables de entorno (PowerShell)
├── .gitignore
└── README.md
```

## Decisiones de diseño

- **Módulos separados por servicio** (`backend`, `frontend`) para reutilizarlos en
  distintos entornos sin duplicar código.
- **Un único entorno desplegado** (`environments/prod`), que corresponde a la
  rama `main` de GitHub.
- **Entornos como carpetas** bajo `environments/`; cada uno parametriza los
  módulos y define su propio estado.
- **API Gateway HTTP API** (v2) con ruta `$default` e integración `AWS_PROXY`
  (payload 2.0), más simple y económico que REST API para este caso.
- **`apig-wsgi`** como adaptador WSGI→Lambda (`apps/backend/lambda_handler.py`).
- **S3 privado + CloudFront OAC**: el bucket no es público; CloudFront lo lee
  mediante Origin Access Control con política `s3:GetObject` acotada a la
  distribución.
- **SPA**: `custom_error_response` (403/404 → `index.html` con 200) para que
  Angular maneje las rutas.

## Requisitos

- [Terraform](https://developer.hashicorp.com/terraform/downloads) >= 1.5.0.
- Credenciales AWS (se recomienda vía archivo `.env` + loader, ver abajo).
- Para empaquetar el backend: `python3`, `pip` y `zip`.
- Para desplegar el frontend: `bun` y la AWS CLI.

### Credenciales AWS con `.env`

Terraform no lee `.env` de forma nativa; para evitar definir variables en cada
sesión de PowerShell se usa un loader:

1. Copia la plantilla y rellénala:

   ```powershell
   cd infra\environments\prod
   Copy-Item .env.example .env
   # edita .env con tus claves reales (AWS_ACCESS_KEY_ID, ...)
   ```

2. Carga las variables en la sesión (dot-source):

   ```powershell
   . ..\..\scripts\load-env.ps1   # lee ./.env y exporta las variables
   ```

   El `.env` está ignorado por git (solo se commitea `.env.example`).

## Flujo de despliegue

### 1. Empaquetar el backend

```powershell
& infra\scripts\package-lambda.ps1        # Windows
# o, en Linux/CI:
# bash infra/scripts/package-lambda.sh
```

Genera `infra/build/lambda.zip` (dependencias + código de `apps/backend`).

### 2. Configurar el entorno

```powershell
cd infra\environments\prod
Copy-Item terraform.tfvars.example terraform.tfvars   # ajusta bucket_name, etc.
Copy-Item .env.example .env                            # credenciales AWS
. ..\..\scripts\load-env.ps1                           # exporta las variables
# (opcional) estado remoto:
Copy-Item backend.tf.example backend.tf                # configura tu bucket de estado
```

### 3. Aplicar la infraestructura

```powershell
cd infra\environments\prod
. ..\..\scripts\load-env.ps1
terraform init
terraform plan
terraform apply
```

### 4. Desplegar el frontend

```powershell
# bucket y distribution_id salen de los outputs de terraform apply
& infra\scripts\deploy-frontend.ps1 -Bucket <BUCKET> -DistributionId <DISTRIBUTION_ID>
# o, en Linux/CI:
# bash infra/scripts/deploy-frontend.sh <BUCKET> <DISTRIBUTION_ID>
```

El build de Angular 19 deja la app en `dist/frontend/browser`; los scripts ya
sincronizan ese subdirectorio al bucket.

## Pendientes / notas

- **API base del frontend**: en local, Angular usa el proxy (`proxy.conf.json`)
  hacia `localhost:5000`. En producción hay que apuntar `ConciliacionService` a
  la URL de API Gateway (variable de entorno o configuración de build).
- **Dominio propio + HTTPS**: hoy CloudFront usa el certificado por defecto. Para
  un dominio custom hace falta ACM (`us-east-1`) y pasar `aliases` al módulo
  frontend (ajustando `viewer_certificate`).
- **VPC / capa de red**: no se incluye; la Lambda queda con acceso a internet
  para CloudWatch. No se definen `VpcConfig`.
- **Límites de la Lambda**: si la app creciera, convendría una Lambda Layer para
  dependencias y/o Docker en lugar del zip.
