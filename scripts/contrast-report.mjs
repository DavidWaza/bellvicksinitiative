// Generates docs/design/contrast.md — every text/background pair the UI uses, checked against WCAG.
// Run: node scripts/contrast-report.mjs   (reads hex values straight from app/assets/css/tailwind.css)
// Add a row to PAIRS whenever a component introduces a new colour combination.
import { readFileSync, writeFileSync } from "node:fs";

const css = readFileSync(new URL("../app/assets/css/tailwind.css", import.meta.url), "utf8");
const hex = Object.fromEntries(
  [...css.matchAll(/--([a-z]+-\d+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1], m[2]]),
);
hex["mint-50"] = hex["forest-50"];
hex["mint-100"] = hex["forest-100"];
hex["mint-150"] = hex["forest-150"];

const lum = (h) => {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

// [foreground, background, kind, where]. kind: "text" (4.5:1), "large" (≥24px or ≥18.66px bold, 3:1), "ui" (non-text, 3:1)
const PAIRS = [
  // Body & headings
  ["base-900", "base-50", "text", "Body text / headings on cream"],
  ["forest-900", "base-50", "text", "Section headings on cream"],
  ["forest-900", "mint-50", "text", "Headings on mint band"],
  ["forest-900", "lavender-50", "text", "Headings on lavender band"],
  ["base-600", "mint-50", "text", "Body copy on mint band"],
  ["base-600", "lavender-50", "text", "Body copy on lavender band"],
  ["base-550", "base-50", "text", "Muted copy on cream"],
  ["base-550", "base-0", "text", "Muted copy on white cards"],
  ["base-550", "mint-50", "text", "Muted copy on mint"],
  ["base-500", "base-50", "text", "Partner wordmarks; placeholders"],
  ["base-500", "base-0", "text", "Input placeholder text"],
  ["forest-500", "base-50", "text", "Links, brand text on cream"],
  ["forest-500", "base-0", "text", "Links on white"],
  // Eyebrows
  ["accent-700", "base-50", "text", "Eyebrow on cream (12px bold)"],
  ["accent-700", "mint-50", "text", "Eyebrow on mint"],
  ["accent-700", "base-0", "text", "Eyebrow on white"],
  ["coral-700", "lavender-50", "text", "Storybook eyebrow on lavender"],
  ["sun-500", "forest-900", "text", "Eyebrow / footer headings on forest"],
  // Highlighted headline words (display sizes only)
  ["accent-600", "base-50", "large", "Headline highlight on cream (≥32px)"],
  ["coral-600", "mint-50", "large", "Headline highlight on mint"],
  ["coral-600", "lavender-50", "large", "Headline highlight on lavender"],
  ["accent-500", "forest-900", "large", "Headline highlight on forest"],
  // Buttons
  ["base-950", "accent-500", "text", "Primary button (dark ink on orange)"],
  ["base-950", "accent-600", "text", "Primary button hover"],
  ["base-0", "forest-500", "text", "Brand button"],
  ["base-0", "forest-600", "text", "Brand button hover"],
  ["base-950", "coral-500", "text", "Coral button (Storybook)"],
  ["forest-500", "base-0", "text", "Light button / brand ghost"],
  ["coral-700", "base-0", "text", "Coral ghost button"],
  ["accent-700", "base-50", "text", "Primary link button on cream"],
  // Footer
  ["base-50", "forest-900", "text", "Footer headings / logo"],
  ["forest-150", "forest-900", "text", "Footer links & copy"],
  ["base-50", "forest-600", "text", "Social icon buttons"],
  // Status pills
  ["sky-700", "sky-50", "text", "Status: active"],
  ["yellow-600", "yellow-50", "text", "Status: closing soon"],
  ["green-600", "green-50", "text", "Status: funded"],
  ["base-550", "base-100", "text", "Status: upcoming"],
  ["red-600", "base-0", "text", "Form error text on white"],
  ["red-600", "base-50", "text", "Form error text on cream (sheet)"],
  ["green-600", "base-0", "text", "Newsletter success on white"],
  // Badges / chips / stickers
  ["forest-500", "mint-100", "text", "Badge: mint"],
  ["lavender-600", "lavender-100", "text", "Badge: lavender"],
  ["base-900", "sun-100", "text", "Badge: sun"],
  ["coral-700", "coral-100", "text", "Badge: coral"],
  ["sky-700", "sky-100", "text", "Badge: sky"],
  ["accent-700", "accent-50", "text", "Badge: accent"],
  ["lavender-600", "base-0", "text", "Age-band chips"],
  ["base-950", "sun-500", "text", "'New' sticker"],
  ["base-950", "coral-100", "text", "Mobile menu Storybook card"],
  ["base-950", "coral-500", "text", "Book cover title (coral)"],
  ["base-950", "sky-150", "text", "Book cover title (sky)"],
  ["base-950", "sun-500", "text", "Book cover title (sun)"],
  ["base-950", "lavender-150", "text", "Book cover title (lavender)"],
  ["base-950", "accent-500", "text", "Dev-only 'content needed' tag"],
  // Handwritten accents (Caveat ≥24px)
  ["coral-700", "lavender-50", "large", "'Read with me!' note"],
  ["forest-900", "base-50", "large", "'Since 2018 ♥' note"],
  ["base-900", "mint-100", "large", "Story quote card"],
  // Inner pages
  ["coral-700", "sun-50", "text", "Storybook eyebrow on sun band"],
  ["forest-900", "sun-50", "text", "Headings on sun band"],
  ["base-550", "base-50", "text", "Breadcrumbs"],
  ["base-900", "sky-50", "text", "Donate 'payments coming soon' note"],
  ["base-900", "yellow-50", "text", "Legal 'draft' note"],
  ["accent-700", "accent-50", "text", "Step numbers on /causes"],
  ["coral-700", "base-50", "text", "Coral links on cream (books page)"],
  ["base-0", "forest-500", "text", "Selected amount / choice pill"],
  // Non-text
  ["accent-600", "base-50", "ui", "Focus ring (5px, cream offset)"],
  ["base-500", "base-0", "ui", "Input border on white"],
  ["base-500", "base-50", "ui", "Input border on cream (sheet)"],
  ["forest-500", "base-0", "ui", "Selected interest chip fill"],
];

const MIN = { text: 4.5, large: 3, ui: 3 };
let failures = 0;
const rows = PAIRS.map(([fg, bg, kind, where]) => {
  const r = ratio(hex[fg], hex[bg]);
  const pass = r >= MIN[kind];
  if (!pass) failures++;
  return `| ${where} | \`${fg}\` ${hex[fg]} | \`${bg}\` ${hex[bg]} | ${kind} (${MIN[kind]}:1) | **${r.toFixed(2)}:1** | ${pass ? "✅" : "❌"} |`;
});

const md = `# Contrast pairs

Generated by \`node scripts/contrast-report.mjs\` from the hex values in \`app/assets/css/tailwind.css\`.
Do not edit by hand — add a pair to the script and re-run it.

Thresholds (WCAG 2.2 AA): body text 4.5:1; large text (≥24px, or ≥18.66px bold) 3:1; UI
components and focus indicators 3:1.

**${PAIRS.length} pairs checked, ${failures} failing.**

| Where | Foreground | Background | Rule | Ratio | |
| --- | --- | --- | --- | --- | --- |
${rows.join("\n")}

## Decisions this forced

- **White on \`accent-500\` is 2.45:1 and is never used.** Solid orange (and coral) buttons carry
  dark ink (\`base-950\`), as the brief suggested.
- **The brief's eyebrow colour, \`accent-600\`, is 3.15:1 on cream** — fine for display text, not
  for 12px labels. Added \`accent-700\` (#A8540A) for eyebrows and small orange text. Same for
  \`coral-700\` (#B0372C) and \`sky-700\` (#1F5F96).
- **Highlighted headline words use \`accent-600\`/\`coral-600\`** — they pass only as large text,
  so \`NHeadingHighlight\` must stay inside display/h2 headings.
- **Focus ring is \`accent-600\`, 3px, with a 2px cream offset**, not \`accent-500\` (2.4:1).
- **Input borders are \`base-500\`**; \`base-150\` (1.3:1) did not identify the field.
- \`base-400\` is decorative only (dots, disabled states) — it fails as text.
`;

writeFileSync(new URL("../docs/design/contrast.md", import.meta.url), md);
console.log(`${PAIRS.length} pairs, ${failures} failing`);
for (const r of rows.filter((x) => x.includes("❌"))) console.log(r);
