"use strict";
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const root = path.resolve(__dirname, "..");
let failed = false;
function error(s) { console.error("OHANA DEPLOY BLOCKED: " + s); failed = true; }
const manifestPath = path.join(root, ".ohana-source-manifest.json");
const statusPath = path.join(root, ".ohana-release-lock.json");
if (!fs.existsSync(manifestPath) || !fs.existsSync(statusPath)) {
  console.error("OHANA DEPLOY BLOCKED: Complete current Cloudflare source and validated release lock are not in GitHub.");
  process.exit(1);
}
let manifest, status;
try {
  manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  status = JSON.parse(fs.readFileSync(statusPath, "utf8"));
} catch (e) {
  console.error("OHANA DEPLOY BLOCKED: Metadata could not be read: " + e.message);
  process.exit(1);
}
if (!status.verifiedAgainstCurrentCloudflare || !status.liveVersion || !status.deploymentId)
  error("Production freshness and deployment ID not verified.");
if (!Array.isArray(manifest) || manifest.length !== status.moduleCount) {
  error("Manifest does not match verified Cloudflare module count.");
  process.exit(1);
}
const seen = new Set();
for (const item of manifest) {
  const name = item.name;
  if (typeof name !== "string" || name.includes("/") || name.includes("\\") || name.startsWith(".") || seen.has(name)) {
    error("Unsafe or duplicate module name: " + name); continue;
  }
  seen.add(name);
  const full = path.join(root, name);
  if (!fs.existsSync(full)) { error("Missing module: " + name); continue; }
  const data = fs.readFileSync(full);
  if (data.length !== item.bytes || crypto.createHash("sha256").update(data).digest("hex") !== item.sha256)
    error("Module differs from manifest: " + name);
}
for (const name of ["worker.js", "app.html", "senior-access.js"]) {
  if (!seen.has(name)) error("Core module not part of verified release: " + name);
}
if (fs.existsSync(path.join(root, "worker.js"))) {
  const worker = fs.readFileSync(path.join(root, "worker.js"), "utf8");
  const imports = [...worker.matchAll(/\\bfrom\\s+["']\\.\\/([^"']+)["']/g)];
  for (const m of imports) if (!seen.has(m[1])) error("Unresolved Worker module: " + m[1]);
}
const config = fs.readFileSync(path.join(root, "wrangler.toml"), "utf8");
for (const required of ['name = "ohana-home"', 'binding = "DB"', 'name = "PUZZLE"', 'class_name = "PuzzleRoom"']) {
  if (!config.includes(required)) error("Missing live Worker configuration: " + required);
}
if (failed) process.exit(1);
console.log("Verified " + manifest.length + " deployed Cloudflare modules against release " + status.liveVersion);
