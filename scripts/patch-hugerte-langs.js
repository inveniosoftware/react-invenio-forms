#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const SRC_DIR = path.resolve(__dirname, "../node_modules/tinymce-i18n/langs6");
const OUT_DIR = path.resolve(__dirname, "../src/lib/forms/locales");

const locales = [
  "ar", "bg_BG", "ca", "cs", "da", "de", "el", "es", "et", "fa", "fi",
  "fr_FR", "hr", "hu_HU", "it", "ja", "ka_GE", "ko_KR", "lt", "nb_NO",
  "pl", "pt_BR", "ro", "ru", "sk", "sv_SE", "tr", "uk", "zh-Hans", "zh-Hant",
];

fs.mkdirSync(OUT_DIR, { recursive: true });

for (const code of locales) {
  const src = path.join(SRC_DIR, `${code}.js`);
  const dest = path.join(OUT_DIR, `${code}.js`);
  if (!fs.existsSync(src)) {
    console.warn(`missing ${src}`);
    continue;
  }
  let text = fs.readFileSync(src, "utf-8");
  // HugeRTE docs: replace `tinymce` variable by `hugerte`.
  // Use `window.hugerte` so it works in bundled strict-mode output.
  text = text.replace(/\btinymce\.addI18n\(/g, "window.hugerte.addI18n(");
  fs.writeFileSync(dest, text);
  console.log(`patched ${code}.js`);
}

console.log("done.");
