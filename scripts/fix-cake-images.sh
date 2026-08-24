#!/bin/bash
# Fix cake images by removing video play buttons
# Affected positions: 3,4,5,6,8,9,13,16,17,18,20,21,23,25,26,27,28
# Map to filenames: 20,24,15,16,09,01,27,21,22,23,13,14,19,08,10,11,12

CAKE_DIR="/home/z/my-project/public/cakes"
OUTPUT_DIR="/home/z/my-project/public/cakes"

# Array of cake numbers to fix
CAKES=(20 24 15 16 09 01 27 21 22 23 13 14 19 08 10 11 12)

PROMPT="Remove the video play button/triangle icon from this image. Keep everything else exactly the same - the cake, all decorations, text, colors, and background must remain identical. Only remove the play button symbol."

mkdir -p "$OUTPUT_DIR"

for cake_num in "${CAKES[@]}"; do
  INPUT="${CAKE_DIR}/cake_${cake_num}.jpg"
  OUTPUT="${OUTPUT_DIR}/cake_${cake_num}.jpg"
  
  if [ ! -f "$INPUT" ]; then
    echo "⚠️  SKIP: cake_${cake_num}.jpg not found"
    continue
  fi
  
  echo "🔄 Processing cake_${cake_num}.jpg..."
  
  # Backup original
  cp "$INPUT" "${CAKE_DIR}/cake_${cake_num}_backup.jpg"
  
  # Edit image - remove play button
  z-ai image-edit -p "$PROMPT" -i "$INPUT" -o "$OUTPUT" -s 864x1152 2>&1
  
  if [ $? -eq 0 ] && [ -f "$OUTPUT" ]; then
    SIZE=$(stat -c%s "$OUTPUT")
    echo "✅ DONE: cake_${cake_num}.jpg (${SIZE} bytes)"
  else
    echo "❌ FAIL: cake_${cake_num}.jpg - restoring backup"
    cp "${CAKE_DIR}/cake_${cake_num}_backup.jpg" "$INPUT"
  fi
  
  echo ""
done

echo "========================================"
echo "Processing complete!"
echo "========================================"
