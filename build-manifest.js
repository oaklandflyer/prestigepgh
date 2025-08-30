@'
// build-manifest.js
const fs = require("fs");
const path = require("path");

const root = __dirname;
const originalsDir = path.join(root, "public", "gallery", "originals");
const outDir = path.join(root, "public", "gallery");
const outPath = path.join(outDir, "imagePaths.json");

// include common image types; preserve filename case from disk
const exts = new Set([".jpg",".jpeg",".png",".webp",".avif",".JPG",".JPEG",".PNG",".WEBP",".AVIF"]);

if (!fs.existsSync(originalsDir)) {
  throw new Error(`Originals folder not found: ${originalsDir}`);
}

// get files
const files = fs.readdirSync(originalsDir).filter(f => exts.has(path.extname(f)));
files.sort(); // simple alphabetical

// build manifest entries that point DIRECTLY to originals (no _1600 suffix!)
const items = files.map(f => ({
  alt: path.parse(f).name.replace(/[_-]+/g," ").trim(),
  widths: [0],
  variants: {
    jpg: {
      0: `/gallery/originals/${f}` // must match server filename & extension exactly
    }
  }
}));

const manifest = { categories: { portfolio: items } };

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2));

console.log(`Wrote ${outPath} with ${items.length} item(s).`);
if (items.length) {
  console.log("Example URL:", items[0].variants.jpg["0"]);
}
'@ | Set-Content -NoNewline build-manifest.js
