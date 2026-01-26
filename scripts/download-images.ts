// Download fruit images from Wikipedia API
import { mkdirSync } from 'fs';
import { join } from 'path';

interface FruitToDownload {
  id: string;
  wiki: string;
}

const fruits: FruitToDownload[] = [
  { id: 'apricot', wiki: 'Apricot' },
  { id: 'avocado', wiki: 'Avocado' },
  { id: 'banana', wiki: 'Banana' },
  { id: 'cherry', wiki: 'Cherry' },
  { id: 'coconut', wiki: 'Coconut' },
  { id: 'custard-apple', wiki: 'Custard_apple' },
  { id: 'dragon-fruit', wiki: 'Pitaya' },
  { id: 'feijoa', wiki: 'Feijoa' },
  { id: 'fig', wiki: 'Common_fig' },
  { id: 'grape', wiki: 'Grape' },
  { id: 'grapefruit', wiki: 'Grapefruit' },
  { id: 'honeydew', wiki: 'Honeydew_(melon)' },
  { id: 'lime', wiki: 'Lime_(fruit)' },
  { id: 'lychee', wiki: 'Lychee' },
  { id: 'mandarin', wiki: 'Mandarin_orange' },
  { id: 'mulberry', wiki: 'Mulberry' },
  { id: 'nectarine', wiki: 'Nectarine' },
  { id: 'orange', wiki: 'Orange_(fruit)' },
  { id: 'papaya', wiki: 'Papaya' },
  { id: 'passionfruit', wiki: 'Passion_fruit' },
  { id: 'peach', wiki: 'Peach' },
  { id: 'pear', wiki: 'Pear' },
  { id: 'persimmon', wiki: 'Persimmon' },
  { id: 'pineapple', wiki: 'Pineapple' },
  { id: 'plum', wiki: 'Plum' },
  { id: 'pomegranate', wiki: 'Pomegranate' },
  { id: 'quince', wiki: 'Quince' },
  { id: 'raspberry', wiki: 'Raspberry' },
  { id: 'rhubarb', wiki: 'Rhubarb' },
  { id: 'starfruit', wiki: 'Carambola' },
  { id: 'strawberry', wiki: 'Strawberry' },
  { id: 'tangelo', wiki: 'Tangelo' },
  { id: 'watermelon', wiki: 'Watermelon' },
];

const imageDir = join(import.meta.dir, '..', 'public', 'images', 'fruits');

// Ensure directory exists
mkdirSync(imageDir, { recursive: true });

async function downloadFruit(fruit: FruitToDownload): Promise<void> {
  try {
    // Get image URL from Wikipedia API
    const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(fruit.wiki)}`;
    const response = await fetch(apiUrl, {
      headers: { 'User-Agent': 'FruityApp/1.0 (nathan@nathans-lab.fyi)' }
    });

    if (!response.ok) {
      console.error(`❌ ${fruit.id}: API error ${response.status}`);
      return;
    }

    const data = await response.json() as {
      thumbnail?: { source: string };
      originalimage?: { source: string };
    };

    // Get thumbnail URL and scale to 800px
    let imageUrl = data.thumbnail?.source;
    if (!imageUrl && data.originalimage?.source) {
      imageUrl = data.originalimage.source;
    }

    if (!imageUrl) {
      console.error(`❌ ${fruit.id}: No image found in Wikipedia`);
      return;
    }

    // Convert thumbnail to 800px version
    imageUrl = imageUrl.replace(/\/\d+px-/, '/800px-');

    // Download the image
    let imageResponse = await fetch(imageUrl, {
      headers: { 'User-Agent': 'FruityApp/1.0 (nathan@nathans-lab.fyi)' }
    });

    // If 800px fails, try original
    if (!imageResponse.ok && data.originalimage?.source) {
      imageUrl = data.originalimage.source;
      imageResponse = await fetch(imageUrl, {
        headers: { 'User-Agent': 'FruityApp/1.0 (nathan@nathans-lab.fyi)' }
      });
    }

    if (!imageResponse.ok) {
      console.error(`❌ ${fruit.id}: Failed to download image (${imageResponse.status})`);
      return;
    }

    const buffer = await imageResponse.arrayBuffer();
    const outputPath = join(imageDir, `${fruit.id}.jpg`);
    await Bun.write(outputPath, buffer);

    const sizeKB = (buffer.byteLength / 1024).toFixed(0);
    console.log(`✅ ${fruit.id}: ${sizeKB}KB`);

  } catch (error) {
    console.error(`❌ ${fruit.id}: ${error}`);
  }
}

async function main(): Promise<void> {
  console.log(`\n🍎 Fruity Image Downloader (Wikipedia)\n`);
  console.log(`Downloading ${fruits.length} fruit images...`);
  console.log(`Output: ${imageDir}\n`);

  for (const fruit of fruits) {
    await downloadFruit(fruit);
    // Small delay to be nice to Wikipedia
    await new Promise(r => setTimeout(r, 300));
  }

  console.log('\n✓ Download complete!');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
