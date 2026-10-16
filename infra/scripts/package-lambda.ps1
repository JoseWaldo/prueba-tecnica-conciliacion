<#
.SYNOPSIS
  Empaqueta la app Flask para Lambda en infra/build/lambda.zip (Windows).

.DESCRIPTION
  Envoltorio de package-lambda.py para PowerShell. Usa el Python del entorno
  virtual del backend si existe; si no, `python` del PATH.

.EXAMPLE
  & infra\scripts\package-lambda.ps1
#>

$ErrorActionPreference = "Stop"

$venvPython = Join-Path (Resolve-Path (Join-Path $PSScriptRoot "..\..")) "apps\backend\.venv\Scripts\python.exe"
$python = if (Test-Path -LiteralPath $venvPython) { $venvPython } else { "python" }

& $python (Join-Path $PSScriptRoot "package-lambda.py")
exit $LASTEXITCODE
