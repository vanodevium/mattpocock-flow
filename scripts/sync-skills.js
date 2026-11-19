// Syncs src/data/skills.json with github.com/mattpocock/skills and prints what changed.
// Stops with exit code 1 if page content mentions a skill that no longer exists.
import { readdir, readFile, writeFile } from "node:fs/promises";
import { collectRefs, diffSkills, mergeSkills } from "./lib/compare.js";
import { loadUpstream } from "./lib/upstream.js";

const DATA_DIR = "src/data";
const SKILLS_JSON = `${DATA_DIR}/skills.json`;
const clip = (v) => {
  const s = String(v ?? "∅").replace(/\s+/g, " ");
  return s.length > 60 ? `${s.slice(0, 59)}…` : s;
};

const current = JSON.parse(await readFile(SKILLS_JSON, "utf8"));
const upstream = await loadUpstream();
const d = diffSkills(current.skills, upstream.skills);

console.log(
  `skills sync · mattpocock/skills@main · plugin v${upstream.pluginVersion} · ${upstream.skills.length} skills`,
);
for (const s of d.added)
  console.log(
    `  + ${s.name} (${s.category}, ${s.invocation}-invoked): set "stage" and "short" in ${SKILLS_JSON}`,
  );
for (const s of d.removed) console.log(`  - ${s.name}`);
for (const s of d.changed) {
  console.log(`  ~ ${s.name}`);
  for (const f of s.fields)
    console.log(`      ${f.field}: ${clip(f.from)} → ${clip(f.to)}`);
}
console.log(`  = ${d.unchanged} unchanged`);

const skills = mergeSkills(current.skills, upstream.skills);
const next = `${JSON.stringify(
  {
    source: {
      repo: "https://github.com/mattpocock/skills",
      ref: "main",
      pluginVersion: upstream.pluginVersion,
    },
    skills,
  },
  null,
  2,
)}\n`;
if (next === (await readFile(SKILLS_JSON, "utf8")))
  console.log(`  ✓ ${SKILLS_JSON} is up to date`);
else {
  await writeFile(SKILLS_JSON, next);
  console.log(`  ✓ wrote ${SKILLS_JSON}`);
}

const content = {};
for (const f of await readdir(DATA_DIR)) {
  if (f.endsWith(".json") && f !== "skills.json")
    content[f.slice(0, -5)] = JSON.parse(
      await readFile(`${DATA_DIR}/${f}`, "utf8"),
    );
}
const known = new Set(skills.map((s) => s.name));
const refs = collectRefs(content);
const broken = refs.filter((r) => !known.has(r.name));
for (const r of broken)
  console.log(`  ✗ ${r.file} ${r.where}: "${r.name}" is not a known skill`);
if (broken.length) process.exit(1);
console.log(`  ✓ all ${refs.length} skill references resolve`);
