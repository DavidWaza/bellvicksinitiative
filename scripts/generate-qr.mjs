// Generates the printable QR codes listed in app/shared/qr-codes.json (each shown on its own
// unlisted page, /qr/<name>). Run: node scripts/generate-qr.mjs   (after adding or changing one)
//
// Writes public/qr/<name>.svg (sharp at any print size) and a 2048px PNG. Dark green on white,
// with high error correction so a code still scans when printed small or slightly damaged.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import QRCode from "qrcode";
import codes from "../app/shared/qr-codes.json" with { type: "json" };

const OUT = join(fileURLToPath(new URL("..", import.meta.url)), "public/qr");
const options = {
  errorCorrectionLevel: "H",
  margin: 2,
  color: { dark: "#0f3526", light: "#ffffff" },
};

mkdirSync(OUT, { recursive: true });
for (const [name, { url }] of Object.entries(codes)) {
  writeFileSync(join(OUT, `${name}.svg`), await QRCode.toString(url, { ...options, type: "svg" }));
  await QRCode.toFile(join(OUT, `${name}.png`), url, { ...options, width: 2048 });
  console.log(`/qr/${name}: ${url}`);
}
