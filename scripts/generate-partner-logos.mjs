// Prepares partner logos for the site from the files in brand/partners/.
// Run: node scripts/generate-partner-logos.mjs   (after adding or replacing a logo there)
//
// Each logo is trimmed to its visible edges and written to public/partners/<slug>.webp + .png.
// Some partners supplied "dark-mode" logos with WHITE wordmarks (invisible on our cream and white
// cards): list them in DARKEN_WHITE and their near-white pixels are re-inked in the site's dark ink.
import { mkdirSync, readdirSync } from "node:fs";
import { basename, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SRC = join(ROOT, "brand/partners");
const OUT = join(ROOT, "public/partners");
mkdirSync(OUT, { recursive: true });

/** Logos whose white text must become dark to show on light backgrounds. */
const DARKEN_WHITE = new Set(["birthright-properties", "ville-infinity-homes"]);
const INK = [0x1d, 0x1a, 0x15]; // --base-900
/** Output height in px: shown at ≤64px tall, so this covers 2× screens without upscaling much. */
const HEIGHT = 128;

for (const file of readdirSync(SRC).filter((f) => /\.(png|webp|jpe?g)$/i.test(f))) {
  const slug = basename(file, extname(file));
  const { data, info } = await sharp(join(SRC, file))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 8) {
      data[i + 3] = 0; // stray near-transparent specks would defeat the trim
      continue;
    }
    if (!DARKEN_WHITE.has(slug)) continue;
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);
    // Light and unsaturated (white / light grey text), not the coloured artwork.
    if (min > 150 && max - min < 40) {
      // Keep the antialiasing: lighter source pixel → same alpha, dark ink colour.
      [data[i], data[i + 1], data[i + 2]] = INK;
    }
  }

  const trimmed = await sharp(data, { raw: info }).trim({ threshold: 0 }).png().toBuffer();
  const meta = await sharp(trimmed).metadata();
  const height = Math.min(HEIGHT, meta.height);
  const resized = sharp(trimmed).resize({ height, withoutEnlargement: true });
  await resized.clone().webp({ quality: 90, alphaQuality: 100 }).toFile(join(OUT, `${slug}.webp`));
  await resized.clone().png({ compressionLevel: 9 }).toFile(join(OUT, `${slug}.png`));
  const out = await sharp(join(OUT, `${slug}.png`)).metadata();
  console.log(`${slug}: ${out.width}×${out.height}${DARKEN_WHITE.has(slug) ? " (white text darkened)" : ""}`);
}
