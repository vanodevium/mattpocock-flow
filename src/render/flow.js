// Git-flow style diagram (time flows down, one lane per place work lives),
// drawn as inline SVG from src/data/flow.json. All geometry lives here; colours come from CSS.
import { esc, secHead, stageClass } from "./util.js";

const G = {
  left: 92,
  lane: 128,
  head: 34,
  top: 96,
  row: 46,
  r: 9,
  right: 290,
  bottom: 40,
};
const MONO_W = 7.3; // approx. glyph width of 12px mono, for sizing tag pills

export function renderFlow(flow, head, ctx) {
  const laneIx = new Map(flow.lanes.map((l, i) => [l.id, i]));
  const x = (lane) => G.left + G.lane * laneIx.get(lane) + G.lane / 2;
  const y = (row) => G.top + row * G.row;
  const rows = flow.events.length;
  const width = G.left + G.lane * flow.lanes.length + G.right;
  const height = y(rows - 1) + G.bottom;

  // first/last row per lane, and an index to find "latest earlier event in lane"
  const seen = new Map();
  flow.events.forEach((e, i) => {
    if (!laneIx.has(e.lane))
      throw new Error(`flow.json: event ${i} uses unknown lane "${e.lane}"`);
    const s = seen.get(e.lane) ?? { first: i, last: i, rows: [] };
    s.last = i;
    s.rows.push(i);
    seen.set(e.lane, s);
  });
  const latestBefore = (lane, row) =>
    (seen.get(lane)?.rows ?? []).filter((r) => r < row).at(-1);

  const laneLines = flow.lanes
    .map((l) => {
      const s = seen.get(l.id);
      if (!s && !l.full) return "";
      const y1 = l.full ? G.head + 18 : y(s.first);
      const y2 = l.full ? height - 12 : y(s.last);
      return `<line class="lane-line ${stageClass(l.stage)}" x1="${x(l.id)}" y1="${y1}" x2="${x(l.id)}" y2="${y2}"/>`;
    })
    .join("");

  const heads = flow.lanes
    .map((l) => {
      const w = l.label.length * 7.6 + 26;
      return `<g class="lane-head ${stageClass(l.stage)}"><rect x="${x(l.id) - w / 2}" y="${G.head - 15}" width="${w}" height="30" rx="15"/><text x="${x(l.id)}" y="${G.head + 5}" text-anchor="middle">${esc(l.label)}</text></g>`;
    })
    .join("");

  const times = flow.events
    .map((e, i) =>
      e.time
        ? `<line class="time-guide" x1="${G.left - 6}" y1="${y(i)}" x2="${width - 20}" y2="${y(i)}"/><text class="time" x="${G.left - 14}" y="${y(i) + 5}" text-anchor="end">${esc(e.time)}</text>`
        : "",
    )
    .join("");

  const arrows = flow.events
    .map((e, i) => {
      if (!e.from) return "";
      const src = latestBefore(e.from, i);
      const x1 = x(e.from),
        y1 = src == null ? G.head + 18 : y(src);
      const x2 = x(e.lane),
        ey = y(i) - G.r - 4;
      const sy = y1 + (src == null ? 0 : G.r + 2);
      const bend = Math.max(sy, ey - G.row * 0.6);
      const k = (ey - bend) * 0.55;
      // start at the bend: the source lane's own line already carries the way down
      return `<path class="arrow" d="M${x1} ${bend} C${x1} ${bend + k}, ${x2} ${ey - k}, ${x2} ${ey}" marker-end="url(#flow-head)"/>`;
    })
    .join("");

  const lane = (id) => flow.lanes[laneIx.get(id)];
  const dots = flow.events
    .map((e, i) => {
      const cx = x(e.lane),
        cy = y(i);
      const tx = cx + G.r + 12;
      const label = e.skill
        ? `<tspan class="cmd">${esc(ctx.cmd(e.skill))}</tspan><tspan class="note" dx="8">${esc(e.note ?? "")}</tspan>`
        : `<tspan class="file">${esc(e.note ?? "")}</tspan>`;
      // approximate text width, so a backing plate can hide lane lines under the label
      const labelW = e.skill
        ? ctx.cmd(e.skill).length * 7.6 + 8 + (e.note ?? "").length * 6.7
        : (e.note ?? "").length * MONO_W;
      const plate = `<rect class="label-bg" x="${tx - 5}" y="${cy - 11}" width="${labelW + 10}" height="22" rx="5"/>`;
      let tag = "";
      if (e.tag) {
        const w = e.tag.length * MONO_W + 18;
        const tx0 = cx - G.r - 10 - w;
        tag = `<g class="tag-pill"><rect x="${tx0}" y="${cy - 12}" width="${w}" height="24" rx="6"/><text x="${tx0 + w / 2}" y="${cy + 4}" text-anchor="middle">${esc(e.tag)}</text></g>`;
      }
      return `<g class="ev ${stageClass(lane(e.lane).stage)}">${tag}<circle cx="${cx}" cy="${cy}" r="${G.r}"/>${plate}<text class="label" x="${tx}" y="${cy + 4.5}">${label}</text></g>`;
    })
    .join("");

  return `
<section id="flow" class="sec-flow" aria-labelledby="flow-h">
  <div class="wrap">${secHead("flow", head, ctx)}
    <div class="box flow-box">
      <div class="flow-scroll">
        <svg class="flow-svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="flow-h">
          <defs><marker id="flow-head" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="arrow-head" d="M0 0 L10 5 L0 10 z"/></marker></defs>
          <text class="axis" x="16" y="${G.top}" transform="rotate(90 16 ${G.top})">time →</text>
          ${times}${laneLines}${arrows}${heads}${dots}
        </svg>
      </div>
    </div>
    ${head.hint ? `<p class="flow-hint">${esc(head.hint)}</p>` : ""}
  </div>
</section>`;
}
