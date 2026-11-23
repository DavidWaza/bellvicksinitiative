// Generates the printable QR code for the storybook page (shown on the unlisted /qr/storybook).
// Run: node scripts/generate-qr.mjs   (after changing the link below)
//
// Writes an SVG (sharp at any print size) and a 2048px PNG. Dark green on white, with high error
// correction so it still scans when printed small or slightly damaged.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import QRCode from "qrcode";

const URL_TO_ENCODE = "https://www.bellvicksinitiative.org/create-your-storybook";
const OUT = join(fileURLToPath(new URL("..", import.meta.url)), "public/qr");
const options = {
  errorCorrectionLevel: "H",
  margin: 2,
  color: { dark: "#0f3526", light: "#ffffff" },
};

mkdirSync(OUT, { recursive: true });
writeFileSync(
  join(OUT, "create-your-storybook.svg"),
  await QRCode.toString(URL_TO_ENCODE, { ...options, type: "svg" }),
);
await QRCode.toFile(join(OUT, "create-your-storybook.png"), URL_TO_ENCODE, {
  ...options,
  width: 2048,
});
console.log(`QR code for ${URL_TO_ENCODE} written to public/qr/`);
