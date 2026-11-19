import { esc, md, secHead, stageClass } from "./util.js";

export function renderPicker(data, head, ctx) {
  const items = data.situations;
  const buttons = items
    .map((s, i) => {
      const cls = stageClass(s.stage ?? ctx.stageOf(s.skill));
      return `<button type="button" class="sit ${cls}" data-pick="${i}" aria-pressed="${i === 0}" aria-controls="answer-${i}">${esc(s.when)}</button>`;
    })
    .join("");
  const answers = items
    .map((s, i) => {
      const cls = stageClass(s.stage ?? ctx.stageOf(s.skill));
      return `
      <div class="box answer ${cls}" id="answer-${i}" data-answer="${i}"${i === 0 ? "" : " hidden"}>
        <span class="eyebrow">Reach for</span>
        <div class="big">${esc(ctx.cmd(s.skill))}</div>
        <p>${md(s.text)}</p>
        <div class="then">Usually followed by ${(s.then ?? []).map((n) => `<span class="chip c-plain">${esc(ctx.cmd(n))}</span>`).join("")}</div>
      </div>`;
    })
    .join("");

  return `
<section id="picker" class="band" aria-labelledby="picker-h">
  <div class="wrap">${secHead("picker", head, ctx)}
    <div class="picker">
      <div class="situations">${buttons}</div>
      <div class="answers" aria-live="polite">${answers}</div>
    </div>
  </div>
</section>`;
}
