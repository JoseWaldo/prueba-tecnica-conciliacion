#!/usr/bin/env bash
#
# Empaqueta la app Flask para Lambda en infra/build/lambda.zip.
#
# Envoltorio de package-lambda.py (cross-platform). Requiere python3.
#
# Uso:
#   bash infra/scripts/package-lambda.sh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
exec python3 "$ROOT_DIR/scripts/package-lambda.py"
