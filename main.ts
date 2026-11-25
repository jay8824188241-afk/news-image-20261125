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

const sourcePath = new URL(`./${SOURCE_NAME}`, import.meta.url);
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const targetPath = join(outputDir, OUTPUT_NAME);

const bytes = readFileSync(sourcePath);
if (bytes.length === 0 || bytes.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") {
  throw new Error("entry.png is missing or is not a PNG file");
}
mkdirSync(outputDir, { recursive: true });
writeFileSync(targetPath, bytes);
console.log(`wrote ${targetPath} (${bytes.length} bytes)`);
