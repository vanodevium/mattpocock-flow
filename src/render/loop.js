import { icon } from "./icons.js";
import { esc, md, secHead, stageClass } from "./util.js";

export function renderLoop(loop, head, ctx) {
  const stages = loop.stages
    .map(
      (s, i) => `
      <article class="stage ${stageClass(s.stage)}">
        <div class="stage-icon tile">${icon(s.icon)}</div>
        <span class="k">${i + 1} · ${esc(s.step)}</span>
        <h3>${esc(s.title)}</h3>
        <p>${md(s.text)}</p>
        <div class="chips">${(s.skills ?? []).map((n) => ctx.chip(n)).join("")}${(s.also ?? []).map((n) => ctx.chip(n, { plain: true })).join("")}</div>
      </article>`,
    )
    .join("");

  const helpers = loop.helpers.skills
    .map(
      (n) =>
        `<div class="helper"><b>${esc(ctx.cmd(n))}</b><span>${md(ctx.blurb(n))}</span></div>`,
    )
    .join("");

  return `
<section id="loop" class="sec-loop" aria-labelledby="loop-h">
  <div class="wrap">${secHead("loop", head, ctx)}
    <div class="loop">${stages}
    </div>
    <div class="back-arrow">
      <svg viewBox="0 0 520 34" preserveAspectRatio="none" aria-hidden="true"><path d="M510 4 C 510 28, 470 30, 260 30 S 10 28, 10 6" fill="none" stroke="var(--muted)" stroke-width="2.5" stroke-dasharray="7 7" stroke-linecap="round"/><path d="M3 14 L10 4 L17 14" fill="none" stroke="var(--muted)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <span>${esc(loop.backArrow)}</span>
    </div>
    <div class="box helpers">
      <div><h3>${esc(loop.helpers.title)}</h3><p>${md(loop.helpers.text)}</p></div>
      <div class="helper-list">${helpers}</div>
    </div>
  </div>
</section>`;
}
