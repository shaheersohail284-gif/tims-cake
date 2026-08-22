#!/usr/bin/env python3
"""Use VLM to identify cake types for naming."""
import subprocess
import json
import os

CAKES_DIR = '/home/z/my-project/public/cakes'
OUTPUT = '/tmp/cake_identifications.json'

def identify_cake(image_path):
    """Use VLM to identify a cake."""
    prompt = """Look at this cake image and identify:
1. The type/style of cake (e.g., chocolate fudge, red velvet, floral, etc.)
2. Key decorations (flowers, candles, text, theme)
3. Occasion if visible (wedding, birthday, etc.)

Reply with ONLY a short JSON: {"style": "...", "decor": "...", "occasion": "..."}
No other text."""
    
    try:
        result = subprocess.run(
            ['z-ai', 'vision', '-p', prompt, '-i', image_path, '-o', '/tmp/vlm_tmp.json'],
            capture_output=True, text=True, timeout=30
        )
        with open('/tmp/vlm_tmp.json') as f:
            data = json.load(f)
        content = data['choices'][0]['message']['content'].strip()
        # Extract JSON from content
        if '{' in content and '}' in content:
            start = content.index('{')
            end = content.rindex('}') + 1
            return json.loads(content[start:end])
        return {"style": "specialty", "decor": "decorated", "occasion": "general"}
    except Exception as e:
        print(f'  Error identifying {image_path}: {e}')
        return {"style": "specialty", "decor": "decorated", "occasion": "general"}

def main():
    results = []
    for i in range(1, 31):
        filepath = os.path.join(CAKES_DIR, f'cake_{i:02d}.jpg')
        if not os.path.exists(filepath):
            print(f'[{i}/30] Missing: {filepath}')
            results.append({"num": i, "style": "specialty", "decor": "decorated", "occasion": "general"})
            continue
        print(f'[{i}/30] Identifying {os.path.basename(filepath)}...')
        info = identify_cake(filepath)
        info['num'] = i
        results.append(info)
        print(f'  -> {info.get("style", "?")}, {info.get("decor", "?")}, {info.get("occasion", "?")}')
    
    with open(OUTPUT, 'w') as f:
        json.dump(results, f, indent=2)
    print(f'\nResults saved to {OUTPUT}')

if __name__ == '__main__':
    main()
