import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

async function main() {
  const zai = await ZAI.create();
  const cakeNumbers = ['19', '27'];
  const prompt = 'Beautiful bakery cake photo, professional food photography, no text, no icons, no symbols, no play buttons. High quality cake image on elegant background.';

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  for (let i = 0; i < cakeNumbers.length; i++) {
    const num = cakeNumbers[i];
    const filePath = path.resolve('/home/z/my-project/public/cakes', `cake_${num}.jpg`);
    console.log(`Processing cake_${num}.jpg...`);

    // Read file and convert to base64 data URL
    const imageBuffer = fs.readFileSync(filePath);
    const base64 = imageBuffer.toString('base64');
    const dataUrl = `data:image/jpeg;base64,${base64}`;

    console.log(`  Calling edit API for cake_${num}...`);
    const result = await zai.images.generations.edit({
      prompt,
      images: [{ url: dataUrl }],
      size: '864x1152',
    });

    // Extract the image from the result (try base64 first, then url)
    if (result.data && result.data[0] && result.data[0].base64) {
      const buffer = Buffer.from(result.data[0].base64, 'base64');
      fs.writeFileSync(filePath, buffer);
      console.log(`  Saved cake_${num}.jpg (${buffer.length} bytes) via base64`);
    } else if (result.data && result.data[0] && result.data[0].url) {
      const response = await fetch(result.data[0].url);
      const buffer = Buffer.from(await response.arrayBuffer());
      fs.writeFileSync(filePath, buffer);
      console.log(`  Saved cake_${num}.jpg (${buffer.length} bytes) via url`);
    } else {
      console.log(`  ERROR: No image data returned for cake_${num}`);
      console.log(`  Result: ${JSON.stringify(result).substring(0, 500)}`);
    }

    if (i < cakeNumbers.length - 1) {
      console.log('  Waiting 10 seconds...');
      await sleep(10000);
    }
  }

  console.log('Done!');
}

main().catch(console.error);
