#!/usr/bin/env bash
#
# Compila el frontend Angular y lo sube al bucket S3, invalidando CloudFront.
#
# Uso:
#   bash infra/scripts/deploy-frontend.sh <BUCKET> [DISTRIBUTION_ID]
#
# Requiere: bun, aws cli con credenciales configuradas.
set -euo pipefail

BUCKET="${1:?Falta el nombre del bucket (primer argumento)}"
DISTRIBUTION_ID="${2:-}"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
FRONTEND_DIR="$ROOT_DIR/apps/frontend"

echo "==> Compilando frontend (producción)"
(cd "$FRONTEND_DIR" && bun install --frozen-lockfile && bun run build)

echo "==> Sincronizando dist con s3://$BUCKET"
aws s3 sync "$FRONTEND_DIR/dist/frontend/browser" "s3://$BUCKET" --delete

if [ -n "$DISTRIBUTION_ID" ]; then
  echo "==> Invalidando caché de CloudFront ($DISTRIBUTION_ID)"
  aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" --paths "/*"
fi

echo "==> Listo"
