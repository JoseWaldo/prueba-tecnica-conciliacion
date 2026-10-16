<#
.SYNOPSIS
  Carga un archivo .env como variables de entorno de la sesión actual.

.DESCRIPTION
  Debe ejecutarse con dot-source (`. .\load-env.ps1`) para que las variables
  queden disponibles en la sesión y las pueda leer Terraform / AWS CLI.

.EXAMPLE
  cd infra\environments\prod
  . ..\..\scripts\load-env.ps1          # carga ./.env
  . ..\..\scripts\load-env.ps1 .env.otro  # carga un archivo específico
  terraform plan
#>

param(
  [string]$EnvFile = ""
)

if (-not $EnvFile) {
  $EnvFile = Join-Path (Get-Location) ".env"
}

if (-not (Test-Path -LiteralPath $EnvFile)) {
  Write-Warning "No se encontró '$EnvFile'. Copia .env.example a .env y rellénalo."
  return
}

Get-Content -LiteralPath $EnvFile | ForEach-Object {
  $line = $_.Trim()

  # Ignora vacíos y comentarios
  if (-not $line -or $line.StartsWith("#") -or -not $line.Contains("=")) {
    return
  }

  $parts = $line -split "=", 2
  $key   = $parts[0].Trim()
  $value = $parts[1].Trim()

  # Quita comillas si las hay
  if ($value.Length -ge 2 -and $value.StartsWith('"') -and $value.EndsWith('"')) {
    $value = $value.Substring(1, $value.Length - 2)
  }
  elseif ($value.Length -ge 2 -and $value.StartsWith("'") -and $value.EndsWith("'")) {
    $value = $value.Substring(1, $value.Length - 2)
  }

  [Environment]::SetEnvironmentVariable($key, $value, "Process")
  Write-Host "  [env] $key" -ForegroundColor DarkGray
}
