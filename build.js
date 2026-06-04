import { rm, mkdir, cp, writeFile } from "fs/promises";
import { h } from "preact";
import render from "preact-render-to-string";
import { Home, Projects, Contact, NotFound } from "./src/components.js";

const doc = (Page) => "<!DOCTYPE html>" + render(h(Page, null));

const pages = [
  { out: "index.html", page: Home },
  { out: "projects/index.html", page: Projects },
  { out: "contact/index.html", page: Contact },
  { out: "404.html", page: NotFound },
];

await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
await cp("public", "dist", { recursive: true });

for (const { out, page } of pages) {
  const path = `dist/${out}`;
  await mkdir(path.slice(0, path.lastIndexOf("/")) || ".", { recursive: true });
  await writeFile(path, doc(page));
  console.log("wrote", out);
}

console.log("done -> dist/");
