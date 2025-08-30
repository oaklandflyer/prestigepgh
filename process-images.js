// process-images.js
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputDir = path.join('C:/Users/couti/Downloads/prestigepgh/gallery/originals');
const outputDir = path.join('public/gallery');
const manifestFile = path.join(outputDir, 'imagePaths.json');

// Sizes you want to generate
const sizes = [480, 960, 1600];

// Ensure output folders exist
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function processImage(file) {
  const baseName = path.parse(file).name.replace(/\s+/g, '_'); // safe filename
  const category = path.basename(path.dirname(file));

  const categoryDir = path.join(outputDir, category);
  ensureDir(categoryDir);

  const variants = { avif: {}, jpg: {} };

  for (const size of sizes) {
    const avifOut = path.join(categoryDir, `${baseName}_${size}.avif`);
    const jpgOut = path.join(categoryDir, `${baseName}_${size}.jpg`);

    // AVIF
    await sharp(file).resize(size).toFormat('avif', { quality: 60 }).toFile(avifOut);
    // JPG
    await sharp(file).resize(size).jpeg({ quality: 80 }).toFile(jpgOut);

    variants.avif[size] = `/gallery/${category}/${baseName}_${size}.avif`;
    variants.jpg[size] = `/gallery/${category}/${baseName}_${size}.jpg`;
  }

  return {
    base: `${category}/${baseName}`,
    alt: baseName,
    widths: sizes,
    variants
  };
}

async function main() {
  ensureDir(outputDir);

  const categories = {};
  const files = fs.readdirSync(inputDir).map(f => path.join(inputDir, f));

  for (const file of files) {
    if (!/\.(jpe?g|png)$/i.test(file)) continue;
    const category = 'Projects'; // You can split by subfolder if needed
    if (!categories[category]) categories[category] = [];

    const item = await processImage(file);
    categories[category].push(item);
    console.log(`Processed ${file}`);
  }

  const manifest = { generatedAt: new Date().toISOString(), categories };
  fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2));
  console.log(`✅ Manifest saved to ${manifestFile}`);
}

main().catch(err => console.error(err));
