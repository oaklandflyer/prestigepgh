// build-manifest.js
const fs = require('fs');
const path = require('path');

const originalsDir = path.join(__dirname, 'public', 'gallery', 'originals');
const outPath      = path.join(__dirname, 'public', 'gallery', 'imagePaths.json');

// file types to include
const exts = new Set(['.jpg','.jpeg','.png','.webp','.avif','.JPG','.JPEG','.PNG','.WEBP','.AVIF']);

// read originals
const files = fs.readdirSync(originalsDir).filter(f => exts.has(path.extname(f)));

// turn each file into a manifest entry that points directly to the original
const items = files.map(f => {
  const url = `/gallery/originals/${f}`;  // <-- this must match the file on the server exactly (case sensitive)
  const alt = path.parse(f).name.replace(/[_-]+/g,' ').trim();
  return {
    alt,
    widths: [0],
    variants: { jpg: { 0: url } }
  };
});

const manifest = { categories: { portfolio: items } };

fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2));
console.log(`Wrote ${outPath} with ${items.length} items`);
