#!/usr/bin/env bash
set -euo pipefail

: "${FRONTEND_BUCKET:?Set FRONTEND_BUCKET from the TriviaMapStaging output}"
: "${FRONTEND_DISTRIBUTION_ID:?Set FRONTEND_DISTRIBUTION_ID from the TriviaMapStaging output}"

REACT_APP_API_BASE_URL="${REACT_APP_API_BASE_URL:-/api}" REACT_APP_NO_INDEX=true npm run build --workspace=@triviamap/front
aws s3 sync apps/front/build/ "s3://$FRONTEND_BUCKET" --delete --cache-control 'public,max-age=31536000,immutable' --exclude index.html
aws s3 cp apps/front/build/index.html "s3://$FRONTEND_BUCKET/index.html" --cache-control 'no-cache,no-store,must-revalidate' --content-type 'text/html'
aws cloudfront create-invalidation --distribution-id "$FRONTEND_DISTRIBUTION_ID" --paths '/*' >/dev/null
