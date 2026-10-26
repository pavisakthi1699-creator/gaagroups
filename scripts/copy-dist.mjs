import { cpSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const distGaa = join(root, "dist", "gaa");
const dist = join(root, "dist");

// Copy all built files from dist/gaa into dist root so hosts like Vercel
// find index.html at root of dist.
cpSync(distGaa, dist, { recursive: true });
console.log("Copied dist/gaa to dist root for host deployment.");
