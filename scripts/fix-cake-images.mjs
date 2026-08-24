import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const CAKE_DIR = '/home/z/my-project/public/cakes';

// Affected cake filenames (mapped from user's position numbers)
const CAKES = ['20','24','15','16','09','01','27','21','22','23','13','14','19','08','10','11','12'];

const PROMPT = 'Remove the video play button/triangle icon from this image. Keep everything else exactly the same - the cake, all decorations, text, colors, and background must remain identical. Only remove the play button symbol.';

async function main() {
  const zai = await ZAI.create();
  
  for (let i = 0; i < CAKES.length; i++) {
    const cakeNum = CAKES[i];
    const inputPath = path.join(CAKE_DIR, `cake_${cakeNum}.jpg`);
    const backupPath = path.join(CAKE_DIR, `cake_${cakeNum}_backup.jpg`);
    
    if (!fs.existsSync(inputPath)) {
      console.log(`\u26a0\ufe0f  SKIP: cake_${cakeNum}.jpg not found`);
      continue;
    }
    
    try {
      // Backup
      if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(inputPath, backupPath);
      }
      
      // Read and convert to base64
      const imageBuffer = fs.readFileSync(inputPath);
      const base64Image = imageBuffer.toString('base64');
      const dataUrl = `data:image/jpeg;base64,${base64Image}`;
      
      console.log(`\ud83d\udd04 [${i+1}/${CAKES.length}] Processing cake_${cakeNum}.jpg...`);
      
      const response = await zai.images.generations.edit({
        prompt: PROMPT,
        images: [{ url: dataUrl }],
        size: '864x1152'
      });
      
      if (response.data && response.data[0] && response.data[0].base64) {
        const buffer = Buffer.from(response.data[0].base64, 'base64');
        fs.writeFileSync(inputPath, buffer);
        console.log(`\u2705 DONE: cake_${cakeNum}.jpg (${buffer.length} bytes)`);
      } else {
        console.log(`\u274c FAIL: No image data returned for cake_${cakeNum}.jpg`);
      }
      
      // Wait between requests to avoid rate limiting
      if (i < CAKES.length - 1) {
        console.log('  Waiting 10 seconds...');
        await new Promise(r => setTimeout(r, 10000));
      }
      
    } catch (error) {
      console.error(`\u274c FAIL: cake_${cakeNum}.jpg - ${error.message}`);
      
      // If failed, restore backup
      if (fs.existsSync(backupPath)) {
        fs.copyFileSync(backupPath, inputPath);
      }
      
      // Wait longer on error
      console.log('  Waiting 15 seconds before retry...');
      await new Promise(r => setTimeout(r, 15000));
      
      // Retry once
      try {
        const imageBuffer = fs.readFileSync(backupPath);
        const base64Image = imageBuffer.toString('base64');
        const dataUrl = `data:image/jpeg;base64,${base64Image}`;
        
        console.log(`\ud83d\udd04 RETRY: cake_${cakeNum}.jpg...`);
        
        const response = await zai.images.generations.edit({
          prompt: PROMPT,
          images: [{ url: dataUrl }],
          size: '864x1152'
        });
        
        if (response.data && response.data[0] && response.data[0].base64) {
          const buffer = Buffer.from(response.data[0].base64, 'base64');
          fs.writeFileSync(inputPath, buffer);
          console.log(`\u2705 RETRY DONE: cake_${cakeNum}.jpg (${buffer.length} bytes)`);
        }
      } catch (retryError) {
        console.error(`\u274c RETRY FAIL: cake_${cakeNum}.jpg - ${retryError.message}`);
        fs.copyFileSync(backupPath, inputPath);
      }
      
      // Wait even longer after retry
      await new Promise(r => setTimeout(r, 15000));
    }
  }
  
  console.log('\n========================================');
  console.log('Processing complete!');
  console.log('========================================');
}

main().catch(console.error);
