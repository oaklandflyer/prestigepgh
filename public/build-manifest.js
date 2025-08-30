// build-image-manifest.mjs
import { readdir, writeFile } from "node:fs/promises";
const DIR = "./public/gallery/originals";       // adjust if needed
const OUT = "./public/gallery/imagePaths.json"; // adjust if needed
const files = (await readdir(DIR)).filter(f=>/\.(jpe?g|png|webp|avif)$/i.test(f));
const photos = files.map(name => ({ path: `/gallery/originals/${name}`, alt: name.replace(/\.[a-z0-9]+$/i,'') }));
const json = { photos };
await writeFile(OUT, JSON.stringify(json, null, 2), "utf8");
console.log(`Wrote ${OUT} with ${photos.length} photos`);
