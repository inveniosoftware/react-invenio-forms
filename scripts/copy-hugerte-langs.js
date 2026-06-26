#!/usr/bin/env node
/**
 * Build script to copy patched HugeRTE language packs into dist/hugerte-langs/.
 *
 * Invenio-supported locales (exact list from invenio-i18n/translations):
 *   ar, bg, ca, cs, da, de, el, en, es, et, fa, fi, fr, hr, hu, it,
 *   ja, ka, ko, lt, no, pl, pt, ro, ru, sk, sv, tr, uk, zh_CN, zh_TW
 *
 * Files are copied with their TinyMCE 6 filenames so RichEditor's mapping works.
 *
 * Source locale files are the ones already patched by `patch-hugerte-langs.js`
 * (tinymce.addI18n -> window.hugerte.addI18n) so they work in bundled strict-mode.
 */

const fs = require("fs");
const path = require("path");

const LOCALES_DIR = path.resolve(__dirname, "../src/lib/forms/locales");
const OUT_DIR = path.resolve(__dirname, "../dist/hugerte-langs");

const invenioLocaleMap = {
  ar: "ar",
  bg: "bg_BG",
  ca: "ca",
  cs: "cs",
  da: "da",
  de: "de",
  el: "el",
  en: null, // English is the default; no pack needed.
  es: "es",
  et: "et",
  fa: "fa",
  fi: "fi",
  fr: "fr_FR",
  hr: "hr",
  hu: "hu_HU",
  it: "it",
  ja: "ja",
  ka: "ka_GE",
  ko: "ko_KR",
  lt: "lt",
  no: "nb_NO",
  pl: "pl",
  pt: "pt_BR",
  ro: "ro",
  ru: "ru",
  sk: "sk",
  sv: "sv_SE",
  tr: "tr",
  uk: "uk",
  zh_CN: "zh-Hans",
  zh_TW: "zh-Hant",
};

function main() {
  if (!fs.existsSync(LOCALES_DIR)) {
    console.error(`patched locales not found at ${LOCALES_DIR}; run 'npm run prepare' first`);
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const [invenioCode, tinymceCode] of Object.entries(invenioLocaleMap)) {
    if (!tinymceCode) continue;

    const src = path.join(LOCALES_DIR, `${tinymceCode}.js`);
    const dest = path.join(OUT_DIR, `${tinymceCode}.js`);

    if (!fs.existsSync(src)) {
      console.warn(`Missing language pack: ${src} (Invenio: ${invenioCode}, TinyMCE: ${tinymceCode})`);
      continue;
    }

    fs.copyFileSync(src, dest);
    console.log(`Copied ${tinymceCode}.js`);
  }

  console.log("Done.");
}

main();
