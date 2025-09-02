
/**
 * process-gallery.mjs
 * Usage:
 *   node process-gallery.mjs <inputGalleryDir=./gallery> <outputDir=./dist>
 *
 * Expects structure like:
 * gallery/
 *   cabinetry/
 *   kitchens/
 *   inprogress/
 *   office/
 *   structural/
 *
 * Produces in <outputDir>:
 *   gallery.json  (manifest)
 *   gallery/<category>/*-{width}.webp
 *   thumbs/<category>/*-thumb.webp
 */
import fs from "fs-extra";
import path from "path";
import fg from "fast-glob";
import sharp from "sharp";

const inputRoot = process.argv[2] || "./gallery";
const outRoot = process.argv[3] || "./dist";

const VALID_EXT = [".jpg", ".jpeg", ".png", ".webp", ".JPG", ".JPEG", ".PNG", ".WEBP"];
const WIDTHS = [1600, 1200, 800];
const THUMB_WIDTH = 400;
const QUALITY = 80;

function niceTitle(filename) {
  return path.basename(filename).replace(/[-_]/g, " ").replace(/\.[^.]+$/, "").replace(/\s+/g, " ").trim();
}

async function processImage(category, filePath) {
  const rel = path.relative(inputRoot, filePath);
  const baseName = path.basename(filePath, path.extname(filePath));
  const title = niceTitle(baseName);

  const outCatDir = path.join(outRoot, "gallery", category);
  const outThumbDir = path.join(outRoot, "thumbs", category);
  await fs.ensureDir(outCatDir);
  await fs.ensureDir(outThumbDir);

  const img = sharp(filePath);
  const meta = await img.metadata();

  // Build responsive sizes
  const sources = [];
  for (const w of WIDTHS) {
    if (meta.width && w > meta.width) continue; // don't upscale
    const outName = `${baseName}-${w}.webp`;
    const outPath = path.join(outCatDir, outName);
    await sharp(filePath)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(outPath);
    sources.push({
      width: w,
      webp: `gallery/${category}/${outName}`
    });
  }

  // Always create a thumb
  const thumbName = `${baseName}-thumb.webp`;
  const thumbPath = path.join(outThumbDir, thumbName);
  await sharp(filePath)
    .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
    .webp({ quality: 70 })
    .toFile(thumbPath);

  return {
    title,
    base: baseName,
    original: path.join(category, path.basename(filePath)),
    width: meta.width || null,
    height: meta.height || null,
    thumb: `thumbs/${category}/${thumbName}`,
    sources
  };
}

async function main() {
  const categories = (await fs.readdir(inputRoot)).filter(async (f) => {
    const full = path.join(inputRoot, f);
    const st = await fs.stat(full);
    return st.isDirectory();
  });

  const manifest = { generatedAt: new Date().toISOString(), categories: {} };

  for (const category of await fs.readdir(inputRoot)) {
    const full = path.join(inputRoot, category);
    const st = await fs.stat(full).catch(() => null);
    if (!st || !st.isDirectory()) continue;

    const patterns = VALID_EXT.map(ext => `${full.replace(/\\/g, "/")}/**/*${ext}`);
    const files = await fg(patterns, { dot: false });

    const entries = [];
    for (const file of files) {
      try {
        const entry = await processImage(category, file);
        entries.push(entry);
      } catch (err) {
        console.error("Failed processing", file, err.message);
      }
    }
    // Sort newest first by file mtime
    entries.sort((a, b) => a.title.localeCompare(b.title));
    manifest.categories[category] = entries;
  }

  await fs.ensureDir(outRoot);
  const manifestPath = path.join(outRoot, "gallery.json");
  await fs.writeJson(manifestPath, manifest, { spaces: 2 });
  console.log("Wrote manifest:", manifestPath);
}
main().catch(err => {
  console.error(err);
  process.exit(1);
});
