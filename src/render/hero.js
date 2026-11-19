import { icon } from "./icons.js";
import { esc, md } from "./util.js";

/** "[x]" → highlighter, "{x}" → squiggle underline. */
const title = (t) =>
  esc(t)
    .replace(/\[([^\]]+)\]/g, '<span class="hl">$1</span>')
    .replace(
      /\{([^}]+)\}/g,
      '<span class="squig">$1<svg viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true"><path d="M2 12 Q 18 2 34 12 T 66 12 T 98 12 T 130 12 T 162 12 T 198 10" fill="none" stroke="var(--tomato)" stroke-width="5" stroke-linecap="round"/></svg></span>',
    );

export function renderTopbar(site, ctx) {
  return `
<aside class="side">
  <div class="brand"><span class="tile c-align">${icon("reflect")}</span>${esc(site.brand)}</div>
  <div class="side-group">
    <span class="side-label">On this page</span>
    <nav aria-label="Sections">${site.nav.map((n, i) => `<a href="${esc(n.href)}"><span class="n">${i + 1}</span>${esc(ctx.fill(n.label))}</a>`).join("")}</nav>
  </div>
  <a class="side-cta" href="${esc(site.repo)}">GitHub repo ↗</a>
</aside>`;
}

export function renderHero(site, ctx) {
  const h = site.hero;
  const lines = h.terminal.map((l, i) => {
    const caret =
      i === h.terminal.length - 1 ? ' <span class="caret"></span>' : "";
    if (l.you != null)
      return `<div><span class="you">you ›</span> ${esc(l.you)}${caret}</div>`;
    if (l.dim != null) return `<div class="dim">${esc(l.dim)}${caret}</div>`;
    return `<div class="q">${esc(l.q)}${caret}</div>`;
  });
  const featured = h.floating.map((n) => ctx.chip(n)).join("");
  return `
<section class="hero" aria-labelledby="h1">
  <div class="wrap">
    <div class="hero-copy">
      <span class="eyebrow">${esc(h.eyebrow)}</span>
      <h1 id="h1">${title(h.title)}</h1>
      <p class="lede">${md(h.lede)}</p>
      <div class="install">
        ${h.install.map((cmd, i) => `<div class="install-row"><code id="cmd${i}">${esc(cmd)}</code><button class="copy" data-copy="cmd${i}" type="button">Copy</button></div>`).join("\n        ")}
        <small>${md(h.installNote)}</small>
      </div>
    </div>
    <div class="stage-art" aria-hidden="true">
      <div class="featured">${featured}</div>
      <div class="term">
        <div class="term-bar"><i></i><i></i><i></i></div>
        <div class="term-body">${lines.join("")}</div>
      </div>
    </div>
  </div>
</section>`;
}
