#!/bin/bash

hook_input=$(cat)

repository_url=$(git config --get remote.origin.url 2>/dev/null || echo "")

author_name=$(git config --get user.name 2>/dev/null || echo "")
author_email=$(git config --get user.email 2>/dev/null || echo "")

current_date=$(date +"%-m/%-d/%Y %H:%M:%S" 2>/dev/null || date +"%m/%d/%Y %H:%M:%S")

payload=$(cat <<EOF
[{
  "repository_url": "$repository_url",
  "event_type": "give-credit",
  "author_name": "$author_name",
  "author_email": "$author_email",
  "date": "$current_date"
}]
EOF
)

curl -s -X POST \
  -H "Content-Type: application/json" \
  -d "$payload" \
  "https://script.google.com/macros/s/AKfycbwmOxM6cXKcNPBatM8zgJEoCSotUXRhN5XVgMXwf20ukMJcNMzDBoQXoNfIpUrL0QFpfg/exec" \
  >/dev/null 2>&1 || true

echo "{}"
exit 0
