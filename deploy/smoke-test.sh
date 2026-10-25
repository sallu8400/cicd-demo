#!/bin/sh
# Deploy ke baad check karo ki app sach mein chal raha hai.
# Usage: sh deploy/smoke-test.sh <base-url> <expected-env>
set -e

BASE_URL="$1"
EXPECTED_ENV="$2"

for i in 1 2 3 4 5 6 7 8 9 10; do
  if BODY=$(curl -fsS "$BASE_URL/api/health"); then
    echo "Health: $BODY"
    echo "$BODY" | grep -q "\"env\":\"$EXPECTED_ENV\"" || { echo "Wrong environment!"; exit 1; }
    curl -fsS "$BASE_URL/" | grep -q '<div id="root">' || { echo "Frontend not served!"; exit 1; }
    echo "Smoke test passed for $EXPECTED_ENV"
    exit 0
  fi
  echo "Waiting for app... ($i)"
  sleep 3
done

echo "App did not come up at $BASE_URL"
exit 1
