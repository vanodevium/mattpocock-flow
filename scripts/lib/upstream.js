// Reads github.com/mattpocock/skills into a list of skills.
const RAW = "https://raw.githubusercontent.com/mattpocock/skills/main/";

async function read(file) {
  const res = await fetch(RAW + file);
  if (!res.ok) throw new Error(`GET ${RAW + file} → HTTP ${res.status}`);
  return res.text();
}

/** Top-level `key: value` pairs from SKILL.md frontmatter; values are bare or double-quoted. */
export function parseFrontmatter(text) {
  const block = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "";
  const out = {};
  for (const line of block.split(/\r?\n/)) {
    const m = line.match(/^([\w-]+):\s*(.+)$/);
    if (m) out[m[1]] = m[2].startsWith('"') ? JSON.parse(m[2]) : m[2];
  }
  return out;
}

/** `- **[name](...)**: summary` bullets from a category README → Map(name → summary). */
export function parseReadme(text) {
  const out = new Map();
  for (const m of text.matchAll(
    /^\s*- \*\*\[([^\]]+)\]\([^)]*\)\*\*:\s*(.*)$/gm,
  ))
    out.set(m[1], m[2].trim());
  return out;
}

/**
 * Which skills exist: `.claude-plugin/plugin.json`.
 * Invocation: `disable-model-invocation: true` in SKILL.md means user-invoked.
 * Summary: the skill's line in skills/<category>/README.md.
 */
export async function loadUpstream() {
  const plugin = JSON.parse(await read(".claude-plugin/plugin.json"));
  const readmes = {};
  const skills = await Promise.all(
    plugin.skills.map(async (p) => {
      const path = p.replace(/^\.\//, "");
      const category = path.split("/")[1];
      readmes[category] ??= read(`skills/${category}/README.md`).then(
        parseReadme,
      );
      const fm = parseFrontmatter(await read(`${path}/SKILL.md`));
      return {
        name: fm.name,
        category,
        invocation:
          fm["disable-model-invocation"] === "true" ? "user" : "model",
        path,
        summary: (await readmes[category]).get(fm.name) || fm.description,
        description: fm.description,
      };
    }),
  );
  return { pluginVersion: plugin.version, skills };
}
