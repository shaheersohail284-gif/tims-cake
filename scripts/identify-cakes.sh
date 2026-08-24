#!/bin/bash

IMAGES=(
  IMG-20260824-WA0125.jpg
  IMG-20260824-WA0126.jpg
  IMG-20260824-WA0128.jpg
  IMG-20260824-WA0134.jpg
  IMG-20260824-WA0141.jpg
  IMG-20260824-WA0143.jpg
  IMG-20260824-WA0144.jpg
  IMG-20260824-WA0146.jpg
  IMG-20260824-WA0150.jpg
  IMG-20260824-WA0163.jpg
  IMG-20260824-WA0164.jpg
  IMG-20260824-WA0167.jpg
  IMG-20260824-WA0176.jpg
  IMG-20260824-WA0184.jpg
  IMG-20260824-WA0185.jpg
  IMG-20260824-WA0186.jpg
  IMG-20260824-WA0187.jpg
  IMG-20260824-WA0189.jpg
  IMG-20260824-WA0194.jpg
  IMG-20260824-WA0195.jpg
  IMG-20260824-WA0196.jpg
  WA_1787580789908.jpeg
)

DIR="/home/z/my-project/upload"

for img in "${IMAGES[@]}"; do
  FILEPATH="$DIR/$img"
  if [ ! -f "$FILEPATH" ]; then
    echo "=== $img === FILE NOT FOUND"
    continue
  fi
  echo "=== $img ==="
  z-ai vision -p 'Describe this cake briefly: type, flavor, text on it, occasion. Keep under 10 words.' -i "$FILEPATH" 2>/dev/null | python3 -c "
import json, sys
raw = sys.stdin.read()
idx = raw.find('{')
if idx >= 0:
    d = json.loads(raw[idx:])
    print(d['choices'][0]['message']['content'])
else:
    print('No JSON found')
" 2>/dev/null || echo 'VLM failed'
  sleep 8
done
