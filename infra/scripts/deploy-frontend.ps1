<#
.SYNOPSIS
  Compila el frontend Angular y lo sube al bucket S3, invalidando CloudFront.

.DESCRIPTION
  Alternativa a deploy-frontend.sh para Windows. El build de Angular 19 deja la
  app en dist/frontend/browser, que es lo que se sincroniza al bucket.

.EXAMPLE
  & infra\scripts\deploy-frontend.ps1 -Bucket conciliacion-frontend-prod-869162497939 -DistributionId E32B4J1AQLS9S6
#>

param(
  [Parameter(Mandatory = $true)]
  [string]$Bucket,

  [string]$DistributionId = ""
)

$ErrorActionPreference = "Stop"

$RootDir  = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$Frontend = Join-Path $RootDir "apps\frontend"
$Dist     = Join-Path $Frontend "dist\frontend\browser"

Write-Host "==> Compilando frontend (producción)"
Push-Location $Frontend
bun install --frozen-lockfile
bun run build
Pop-Location

Write-Host "==> Sincronizando $Dist con s3://$Bucket"
aws s3 sync $Dist "s3://$Bucket" --delete

if ($DistributionId) {
  Write-Host "==> Invalidando caché de CloudFront ($DistributionId)"
  aws cloudfront create-invalidation --distribution-id $DistributionId --paths "/*"
}

Write-Host "==> Listo"
