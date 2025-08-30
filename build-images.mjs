import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import globby from "globby";
import sharp from "sharp";

const SRC = "gallery/source";
const OUT = "gallery/originals";
const MAN = "gallery/imagePaths.json";
const SIZES = [480, 960, 1600];

await mkdir(OUT, { recursive: true });

const files = await globby([`${SRC}/**/*.{jpg,jpeg,png,webp,avif}`, `!**/_*`], { caseSensitiveMatch: false });
if (!files.length) {
  console.log("No images found in", SRC);
  process.exit(0);
}

const photos = [];

for (const file of files) {
  const base = path.parse(file).name.replace(/\s+/g, "_");
  const outVariants = { jpg: {}, avif: {} };
  for (const w of SIZES) {
    const jpgName = `${base}_${w}.jpg`;
    const avifName = `${base}_${w}.avif`;
    const jpgPath = path.join(OUT, jpgName);
    const avifPath = path.join(OUT, avifName);

    // JPG
    await sharp(file).resize({ width: w }).jpeg({ quality: 82 }).toFile(jpgPath);
    // AVIF
    await sharp(file).resize({ width: w }).avif({ quality: 55 }).toFile(avifPath);

    outVariants.jpg[String(w)] = `/gallery/originals/${jpgName}`;
    outVariants.avif[String(w)] = `/gallery/originals/${avifName}`;
  }

  photos.push({
    alt: base.replace(/_/g, " "),
    widths: SIZES,
    variants: outVariants
  });
}

const manifest = { photos };
await writeFile(MAN, JSON.stringify(manifest, null, 2), "utf8");

console.log(`Wrote ${MAN} with ${photos.length} photos`);
console.log(`Optimized images in ${OUT}`);
