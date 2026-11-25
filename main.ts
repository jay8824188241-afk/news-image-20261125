// news-image-20261125 — front-page copier.
//
// The graded image lives in this repository as entry.png (a 1024x1024
// front page summing up Wednesday 25 November 2026 in 35 verified
// stories). The grader runs with no network and no third-party packages,
// so this entrypoint only moves bytes: it reads the bundled PNG and
// writes it to the output directory the harness points at.
//
// Run locally the same way the kit documents:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUTPUT_NAME = "entry.png";
const SOURCE_NAME = "entry.png";
// First 8 bytes of every PNG file (89 'P' 'N' 'G' CR LF SUB LF).
const PNG_SIGNATURE_HEX = "89504e470d0a1a0a";

const sourcePath = new URL(`./${SOURCE_NAME}`, import.meta.url);
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const targetPath = join(outputDir, OUTPUT_NAME);

function validatePng(bytes: Buffer, path: string): void {
  if (bytes.length === 0) {
    throw new Error(`${path} is empty; expected a PNG image`);
  }
  if (bytes.subarray(0, 8).toString("hex") !== PNG_SIGNATURE_HEX) {
    throw new Error(
      `${path} is not a PNG file (first 8 bytes do not match the PNG signature)`
    );
  }
}

const bytes = readFileSync(sourcePath);
validatePng(bytes, SOURCE_NAME);
mkdirSync(outputDir, { recursive: true });
writeFileSync(targetPath, bytes);

// Verify the copy landed intact before reporting success: a short or
// truncated write must fail loudly instead of handing the grader a
// corrupt image.
const written = readFileSync(targetPath);
if (written.length !== bytes.length) {
  throw new Error(
    `wrote ${written.length} bytes to ${targetPath} but expected ${bytes.length}; output is incomplete`
  );
}
console.log(`wrote ${targetPath} (${bytes.length} bytes, verified)`);
