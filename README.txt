
Pittsburgh Prestige Remodeling – Portfolio Pipeline
===================================================

STEP 1: Install dependencies (once per machine)
-----------------------------------------------
1) Ensure Node.js 18+ is installed.
2) In your project root, run:
   npm init -y
   npm i sharp fast-glob fs-extra

STEP 2: Place your images
-------------------------
Put full-resolution images under ./gallery/<category>/...
(e.g., ./gallery/kitchens/*.jpg)

STEP 3: Build optimized images + manifest
-----------------------------------------
Run:
   node process-gallery.mjs ./gallery ./dist

This will:
- Resize to 1600, 1200, 800px WebP variants (no upscaling)
- Create 400px WebP thumbnails
- Write ./dist/gallery.json with category listings

STEP 4: Deploy
--------------
Commit these files to your GitHub Pages repo:
- index.html (this file can replace your current portfolio page)
- process-gallery.mjs
- /gallery (source images)
- /dist (generated assets + gallery.json)

GitHub Pages will serve index.html and the files in /dist.

Windows Tips
------------
- If your source is at C:\Users\couti\Downloads\prestigepgh\gallery, run:
  node process-gallery.mjs "C:\\Users\\couti\\Downloads\\prestigepgh\\gallery" "./dist"
- Quotes + escaping backslashes are important in Windows terminals.

Advanced
--------
- Change output sizes: edit WIDTHS and THUMB_WIDTH in process-gallery.mjs
- Change image quality: adjust QUALITY
- Add/rename categories: just add/remove folders inside ./gallery and rebuild
