#!/usr/bin/env python3
"""Extract og:image URLs from Instagram posts/reels and download them."""
import requests
import re
import os
import time
import sys

INSTAGRAM_URLS = [
    "https://www.instagram.com/tims.cakes/reel/Db_ab45xKca/",
    "https://www.instagram.com/tims.cakes/p/DbOSlCDjK80/",
    "https://www.instagram.com/tims.cakes/p/DZ2XiFLjOwU/",
    "https://www.instagram.com/tims.cakes/p/DY-jToNEanP/",
    "https://www.instagram.com/tims.cakes/p/DYtuu5iDrdy/",
    "https://www.instagram.com/tims.cakes/p/DY3tLnhDDe9/",
    "https://www.instagram.com/tims.cakes/p/DYbhWpLDKUi/",
    "https://www.instagram.com/tims.cakes/reel/DYIxhKsM5im/",
    "https://www.instagram.com/tims.cakes/reel/DXAIe7NOhn8/",
    "https://www.instagram.com/tims.cakes/reel/DWuGnAoDif7/",
    "https://www.instagram.com/tims.cakes/reel/DUNCb-nDLBL/",
    "https://www.instagram.com/tims.cakes/reel/DT54JgHEg1a/",
    "https://www.instagram.com/tims.cakes/reel/DTo5D_jDNVW/",
    "https://www.instagram.com/tims.cakes/reel/DTV3AkdDL2Q/",
    "https://www.instagram.com/tims.cakes/reel/DTEF9vOjCXQ/",
    "https://www.instagram.com/tims.cakes/reel/DSx56c-jm6B/",
    "https://www.instagram.com/tims.cakes/p/DSf2hFJDqbJ/",
    "https://www.instagram.com/tims.cakes/p/DR5CdrGDCkW/",
    "https://www.instagram.com/tims.cakes/reel/DRoVQ1gjC5U/",
    "https://www.instagram.com/tims.cakes/reel/DRV56QCDJzr/",
    "https://www.instagram.com/tims.cakes/reel/DRIEZfgDDP3/",
    "https://www.instagram.com/tims.cakes/reel/DPtGatqjGjc/",
    "https://www.instagram.com/tims.cakes/reel/DPa7s5zDFa6/",
    "https://www.instagram.com/tims.cakes/reel/DPQMeBxDJR7/",
    "https://www.instagram.com/tims.cakes/p/DO4L_4_DLSS/",
    "https://www.instagram.com/tims.cakes/p/DOkLSfHiKoJ/",
    "https://www.instagram.com/tims.cakes/p/DLFSUwxNsPe/",
    "https://www.instagram.com/tims.cakes/p/DK76T7rM3Yi/",
    "https://www.instagram.com/tims.cakes/p/DKzpPS0t5pu/",
    "https://www.instagram.com/tims.cakes/p/DKuSeKdNjrp/",
]

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
}

OUTPUT_DIR = '/home/z/my-project/public/cakes'


def extract_og_image(html):
    """Extract og:image URL from Instagram HTML."""
    # Look for og:image with content attribute
    patterns = [
        r'property=["\']og:image["\']\s+content=["\'](https?://[^"\'\s]+)',
        r'content=["\'](https?://[^"\'\s]+)["\']\s+property=["\']og:image["\']',
    ]
    for pattern in patterns:
        matches = re.findall(pattern, html)
        if matches:
            # Clean up the URL
            url = matches[0]
            url = url.replace('&amp;', '&')
            return url
    return None


def get_higher_res(url):
    """Try to get a higher resolution version of the image."""
    # Replace s640x640 with s1080x1080 for better quality
    url = url.replace('s640x640', 's1080x1080')
    return url


def download_image(url, filepath):
    """Download an image from URL to filepath."""
    try:
        resp = requests.get(url, headers=HEADERS, timeout=30, stream=True)
        if resp.status_code == 200:
            with open(filepath, 'wb') as f:
                for chunk in resp.iter_content(8192):
                    f.write(chunk)
            return True
        else:
            print(f'  Failed to download: HTTP {resp.status_code}')
            return False
    except Exception as e:
        print(f'  Download error: {e}')
        return False


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    results = []
    for i, url in enumerate(INSTAGRAM_URLS):
        num = i + 1
        filename = f'cake_{num:02d}.jpg'
        filepath = os.path.join(OUTPUT_DIR, filename)

        # Skip if already downloaded and valid (> 5KB)
        if os.path.exists(filepath) and os.path.getsize(filepath) > 5000:
            print(f'[{num}/30] {filename} already exists, skipping')
            results.append({'num': num, 'url': url, 'file': filename, 'status': 'skipped'})
            continue

        print(f'[{num}/30] Fetching {url}')
        try:
            resp = requests.get(url, headers=HEADERS, timeout=20)
            print(f'  HTML status: {resp.status_code}, size: {len(resp.text)}')

            og_image = extract_og_image(resp.text)
            if not og_image:
                print(f'  No og:image found!')
                results.append({'num': num, 'url': url, 'file': filename, 'status': 'no_image'})
                continue

            # Try higher resolution
            high_res = get_higher_res(og_image)
            print(f'  Image URL: {high_res[:120]}...')

            if download_image(high_res, filepath):
                size = os.path.getsize(filepath)
                print(f'  Downloaded: {filename} ({size} bytes)')
                results.append({'num': num, 'url': url, 'file': filename, 'status': 'ok', 'size': size})
            else:
                # Fallback to original resolution
                print(f'  Trying original resolution...')
                if download_image(og_image, filepath):
                    size = os.path.getsize(filepath)
                    print(f'  Downloaded: {filename} ({size} bytes)')
                    results.append({'num': num, 'url': url, 'file': filename, 'status': 'ok', 'size': size})
                else:
                    print(f'  FAILED to download image')
                    results.append({'num': num, 'url': url, 'file': filename, 'status': 'download_failed'})

        except Exception as e:
            print(f'  Error: {e}')
            results.append({'num': num, 'url': url, 'file': filename, 'status': 'error', 'error': str(e)})

        # Rate limiting
        if i < len(INSTAGRAM_URLS) - 1:
            time.sleep(2)

    # Summary
    print('\n' + '=' * 60)
    print('SUMMARY')
    print('=' * 60)
    ok = sum(1 for r in results if r['status'] in ('ok', 'skipped'))
    failed = sum(1 for r in results if r['status'] not in ('ok', 'skipped'))
    print(f'Successful: {ok}/30')
    print(f'Failed: {failed}/30')
    if failed > 0:
        print('\nFailed items:')
        for r in results:
            if r['status'] not in ('ok', 'skipped'):
                print(f'  {r["file"]}: {r["status"]} - {r.get("error", "")}')

    # Save results as JSON for reference
    with open('/tmp/instagram_extraction_results.json', 'w') as f:
        json.dump(results, f, indent=2)
    print(f'\nResults saved to /tmp/instagram_extraction_results.json')


if __name__ == '__main__':
    main()
