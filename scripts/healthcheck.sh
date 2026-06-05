#!/bin/bash
# Poll an HTTP endpoint until it returns 2xx, then exit 0.
# Usage: ./healthcheck.sh <url> [max_retries] [sleep_seconds]

URL="${1:-http://localhost:5001/api/test}"
MAX_RETRIES="${2:-30}"
SLEEP_INTERVAL="${3:-2}"

echo "Waiting for service at $URL..."

for i in $(seq 1 "$MAX_RETRIES"); do
    STATUS=$(curl -o /dev/null -s -w "%{http_code}" "$URL")
    if [[ "$STATUS" =~ ^2 ]]; then
        echo "Service is ready (HTTP $STATUS) after attempt $i"
        exit 0
    fi
    echo "Attempt $i/$MAX_RETRIES — got HTTP $STATUS, retrying in ${SLEEP_INTERVAL}s..."
    sleep "$SLEEP_INTERVAL"
done

echo "ERROR: service at $URL did not become healthy after $MAX_RETRIES attempts"
exit 1
