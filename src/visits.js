import { readFileSync, writeFileSync, renameSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const FILE = join(dirname(fileURLToPath(import.meta.url)), "..", "visits.json");

let count = 0;
try {
  const raw = JSON.parse(readFileSync(FILE, "utf8"));
  if (typeof raw.count === "number" && raw.count >= 0) count = Math.floor(raw.count);
} catch {}

let timer = null;
function persist() {
  if (timer) return;
  timer = setTimeout(() => {
    timer = null;
    try {
      const tmp = FILE + ".tmp";
      writeFileSync(tmp, JSON.stringify({ count }));
      renameSync(tmp, FILE);
    } catch {}
  }, 1000);
}

export function bump() {
  count += 1;
  persist();
  return count;
}

export function total() {
  return count;
}
