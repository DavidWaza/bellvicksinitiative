// Generates the logo, favicons and social image from the master artwork.
// Run: node scripts/generate-logo.mjs   (after replacing brand/logo-source.jpg)
//
// The source is a JPEG on white with dark scan edges. This crops the edges, removes the white
// background exactly (un-multiplying white, so antialiased edges stay clean on any background),
// trims to the mark and writes every size the site uses.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SRC = join(ROOT, "brand/logo-source.jpg");
const OUT = join(ROOT, "public/brand");
mkdirSync(OUT, { recursive: true });

// 1. Drop the dark edge strips, then flatten to raw RGB.
const meta = await sharp(SRC).metadata();
const EDGE = 16;
const { data, info } = await sharp(SRC)
  .extract({ left: EDGE, top: EDGE, width: meta.width - EDGE * 2, height: meta.height - EDGE * 2 })
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

// 2. White → transparent: a = max channel distance from white; colour = un-composited over white.
const rgba = Buffer.alloc(info.width * info.height * 4);
for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
  const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
  let a = Math.max(255 - r, 255 - g, 255 - b) / 255;
  if (a < 0.04) a = 0; // JPEG noise on the white field
  const un = (c) => (a === 0 ? 0 : Math.round(Math.min(255, Math.max(0, (c - 255 * (1 - a)) / a))));
  rgba[j] = un(r);
  rgba[j + 1] = un(g);
  rgba[j + 2] = un(b);
  rgba[j + 3] = Math.round(a * 255);
}

// 3. Trim to the mark and square it with a little breathing room.
const trimmed = await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
  .trim({ threshold: 1 })
  .png()
  .toBuffer({ resolveWithObject: true });
const side = Math.max(trimmed.info.width, trimmed.info.height);
const pad = Math.round(side * 0.04);
const square = await sharp(trimmed.data)
  .resize({ width: side, height: side, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .extend({
    top: pad,
    bottom: pad,
    left: pad,
    right: pad,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer();

const transparent = (size, name) =>
  sharp(square).resize(size, size).png({ compressionLevel: 9 }).toFile(join(OUT, name));
const onWhite = (size, name, fmt = "png") =>
  sharp(square)
    .resize(Math.round(size * 0.84), Math.round(size * 0.84))
    .extend({
      top: Math.round(size * 0.08),
      bottom: size - Math.round(size * 0.84) - Math.round(size * 0.08),
      left: Math.round(size * 0.08),
      right: size - Math.round(size * 0.84) - Math.round(size * 0.08),
      background: "#ffffff",
    })
    .flatten({ background: "#ffffff" })
    [fmt]()
    .toFile(join(OUT, name));

await Promise.all([
  // Header / footer mark (shown at ~40–56px; 2× and 3× for sharp screens).
  transparent(96, "logo-96.png"),
  transparent(160, "logo-160.png"),
  sharp(square).resize(160, 160).webp({ quality: 90 }).toFile(join(OUT, "logo-160.webp")),
  // Favicons + home-screen icons.
  transparent(32, "favicon-32.png"),
  transparent(48, "favicon-48.png"),
  onWhite(180, "apple-touch-icon.png"),
  onWhite(192, "icon-192.png"),
  onWhite(512, "icon-512.png"),
  // Full-size transparent master for print / partners.
  transparent(1024, "logo-1024.png"),
]);

// Social share card (1200×630) on the site's cream.
const mark = await sharp(square).resize(440, 440).png().toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 4, background: "#fffbf5" } })
  .composite([{ input: mark, top: 95, left: 380 }])
  .png()
  .toFile(join(OUT, "og-image.png"));

console.log("Logo assets written to public/brand/");

// favicon.ico (browsers still request it): PNG-in-ICO with 16, 32 and 48px images.
const icoSizes = [16, 32, 48];
const pngs = await Promise.all(icoSizes.map((s) => sharp(square).resize(s, s).png().toBuffer()));
const header = Buffer.alloc(6 + 16 * pngs.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(pngs.length, 4);
let offset = header.length;
pngs.forEach((png, i) => {
  const e = 6 + 16 * i;
  header.writeUInt8(icoSizes[i], e);
  header.writeUInt8(icoSizes[i], e + 1);
  header.writeUInt16LE(1, e + 4);
  header.writeUInt16LE(32, e + 6);
  header.writeUInt32LE(png.length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += png.length;
});
writeFileSync(join(ROOT, "public/favicon.ico"), Buffer.concat([header, ...pngs]));
console.log("favicon.ico written");
