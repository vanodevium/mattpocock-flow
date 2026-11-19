import { icon } from "./icons.js";
import { esc, md, secHead, stageClass } from "./util.js";

const WHO = { user: "You type these", model: "The agent reaches for these" };
const title = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/** Groups skills by category, then user-invoked before model-invoked, in upstream order. */
export function groupSkills(skills) {
  const groups = new Map();
  for (const s of skills) {
    const cat = s.category ?? "other";
    for (const inv of ["user", "model"])
      if (!groups.has(`${cat}:${inv}`))
        groups.set(`${cat}:${inv}`, {
          category: cat,
          invocation: inv,
          skills: [],
        });
    groups
      .get(`${cat}:${s.invocation === "user" ? "user" : "model"}`)
      .skills.push(s);
  }
  return [...groups.values()].filter((g) => g.skills.length);
}

// Which sprite icon a skill's tile shows, by its stage.
const STAGE_ICON = {
  align: "align",
  plan: "plan",
  build: "build",
  debug: "debug",
  ship: "ship",
  reflect: "reflect",
  neutral: "setup",
};

export function renderCatalog(site, head, ctx) {
  const groups = groupSkills(ctx.skills)
    .map((g, i) => {
      const rows = g.skills
        .map(
          (s) => `
          <li><a class="skill-row ${stageClass(s.stage)}" href="${esc(`${site.repo}/tree/main/${s.path}`)}">
            <span class="tile">${icon(STAGE_ICON[s.stage] ?? "setup")}</span>
            <span><span class="name">${esc(ctx.cmd(s.name))}</span><span class="desc">${md(s.short || s.summary)}</span></span>
            <span class="go" aria-hidden="true">→</span>
          </a></li>`,
        )
        .join("");
      return `
      <div class="group">
        <header><h3><span class="n">${String(i + 1).padStart(2, "0")}</span>${esc(title(g.category))}</h3><span class="tag">${WHO[g.invocation]} · ${g.skills.length}</span></header>
        <ul class="rows">${rows}</ul>
      </div>`;
    })
    .join("");

  const rules = site.principles
    .map(
      (r) =>
        `<div class="box rule"><h3>${esc(r.title)}</h3><p>${md(r.text)}</p></div>`,
    )
    .join("");

  return `
<section id="all" aria-labelledby="catalog-h">
  <div class="wrap">${secHead("catalog", head, ctx)}
    <div class="index">${groups}
    </div>
    <div class="rules">${rules}</div>
  </div>
</section>`;
}

export function renderFooter(site, data) {
  const src = data.skills?.source ?? {};
  const version = src.pluginVersion
    ? ` · plugin v${esc(src.pluginVersion)}`
    : "";
  return `
<footer>
  <div class="wrap">
    <span>${esc(site.footer.credit)} <a href="${esc(site.repo)}">${esc(site.repo.replace(/^https:\/\//, ""))}</a>${version}</span>
    <span>${md(site.footer.update)}</span>
  </div>
</footer>`;
}
