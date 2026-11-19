import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import { renderPage } from "./src/render/page.js";

const DATA_DIR = path.resolve("src/data");

/** Reads every src/data/*.json fresh, keyed by basename (skills.json → data.skills). */
function loadData() {
  const data = {};
  for (const file of readdirSync(DATA_DIR)) {
    if (!file.endsWith(".json")) continue;
    data[path.basename(file, ".json")] = JSON.parse(
      readFileSync(path.join(DATA_DIR, file), "utf8"),
    );
  }
  return data;
}

/**
 * Replaces `<!--@section name-->` markers in index.html with HTML rendered
 * from src/data by the templates in src/render. Data and design stay separate:
 * edit JSON for content, src/render + src/styles for looks.
 */
function prerenderSections() {
  return {
    name: "prerender-sections",
    transformIndexHtml(html) {
      const sections = renderPage(loadData());
      return html.replace(/<!--@section ([\w-]+)-->/g, (_, name) => {
        if (!(name in sections))
          throw new Error(`index.html asks for unknown section "${name}"`);
        return sections[name];
      });
    },
  };
}

export default defineConfig({
  base: "./",
  plugins: [prerenderSections(), viteSingleFile()],
  build: { outDir: "dist", emptyOutDir: true },
});
