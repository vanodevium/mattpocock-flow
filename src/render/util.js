// Shared helpers for templates. Every piece of data goes through esc() or md(),
// so upstream text can never inject markup.

export const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (ch) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        ch
      ],
  );

/** Tiny inline formatter: `code` and **bold**. */
export const md = (s) =>
  esc(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");

export const STAGES = [
  "align",
  "plan",
  "build",
  "debug",
  "ship",
  "reflect",
  "neutral",
];
export const stageClass = (stage) =>
  `c-${STAGES.includes(stage) ? stage : "neutral"}`;

export function createCtx(data) {
  const skills = data.skills?.skills ?? [];
  const byName = new Map(skills.map((s) => [s.name, s]));
  const skill = (name) => byName.get(name);
  const stageOf = (name) => skill(name)?.stage ?? "neutral";
  /** How you'd type it: user-invoked skills get a slash. */
  const cmd = (name) => (skill(name)?.invocation === "user" ? "/" : "") + name;
  const chip = (name, { plain = false, bare = false } = {}) =>
    `<span class="chip ${plain ? "c-plain" : stageClass(stageOf(name))}">${esc(bare ? name : cmd(name))}</span>`;
  const blurb = (name) => skill(name)?.short || skill(name)?.summary || "";
  const count = skills.length;
  const fill = (s) => String(s ?? "").replaceAll("{count}", count);
  return { skills, skill, stageOf, cmd, chip, blurb, count, fill };
}

export const secHead = (id, head, ctx) => `
    <div class="sec-head">
      <span class="eyebrow">${esc(head.eyebrow)}</span>
      <h2 id="${id}-h">${esc(ctx.fill(head.title))}</h2>
      <p class="lede">${md(ctx.fill(head.lede))}</p>
    </div>`;
