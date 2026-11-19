import { icon } from "./icons.js";
import { esc, md, secHead, stageClass } from "./util.js";

export function renderDay(day, head, ctx) {
  const slots = day.slots
    .map((s) => {
      const chips = [
        ...(s.skills ?? []).map((n) => ctx.chip(n)),
        ...(s.also ?? []).map((n) => ctx.chip(n, { plain: true })),
      ].join("");
      const outs = [
        ...(s.outputs ?? []).map((o) => `<span class="file">${esc(o)}</span>`),
        ...(s.helpers ?? []).map(
          (n) => `<span class="chip c-plain mini">${esc(ctx.cmd(n))}</span>`,
        ),
      ].join("");
      return `
      <div class="slot ${stageClass(s.stage)}${s.aside ? " aside" : ""}">
        <div class="time">${esc(s.time)}<small>${esc(s.label)}</small></div>
        <div class="pin"></div>
        <div class="box slot-card">
          <div class="what">
            <h3>${esc(s.title)} ${chips}</h3>
            <p>${md(s.text)}</p>
            ${outs ? `<div class="out">${outs}</div>` : ""}
          </div>
          <div class="slot-art tile">${icon(s.icon)}</div>
        </div>
      </div>`;
    })
    .join("");

  return `
<section id="day" class="band" aria-labelledby="day-h">
  <div class="wrap">${secHead("day", head, ctx)}
    <div class="day">${slots}
    </div>
  </div>
</section>`;
}
