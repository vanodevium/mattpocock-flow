import { esc, md, secHead, stageClass } from "./util.js";

function message(m, i, ctx) {
  const st = `style="--i:${i}"`;
  if (m.you != null)
    return `<div class="msg you" ${st}><span class="who">you</span><div class="b">${md(m.you)}</div></div>`;
  if (m.divider != null)
    return `<div class="divider" ${st}>${esc(m.divider)}</div>`;
  if (m.event) {
    const items = m.event.map((e) =>
      e.skill
        ? ctx.chip(e.skill, { bare: true })
        : e.file
          ? `<span class="file">${esc(e.file)}</span>`
          : `<span>${esc(e.text)}</span>`,
    );
    return `<div class="ev" ${st}>${items.join("")}</div>`;
  }
  const tag = m.ordered ? "ol" : "ul";
  const list = m.list
    ? `<${tag}>${m.list.map((l) => `<li>${md(l)}</li>`).join("")}</${tag}>`
    : "";
  const after = m.after ? `<span class="after">${md(m.after)}</span>` : "";
  const rec = m.rec ? `<span class="rec">→ ${md(m.rec)}</span>` : "";
  return `<div class="msg ai" ${st}><span class="who">claude</span><div class="b">${md(m.ai)}${list}${after}${rec}</div></div>`;
}

export function renderSessions(data, head, ctx) {
  const list = data.sessions;
  const tabs = list
    .map(
      (s, i) => `
      <button class="tab ${stageClass(s.stage)}" type="button" role="tab" id="tab-${esc(s.id)}" aria-controls="panel-${esc(s.id)}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-session="${esc(s.id)}"><span class="sw"></span>${esc(s.label)}</button>`,
    )
    .join("");

  const panels = list
    .map((s, i) => {
      const steps = s.steps
        .map((st, k) => {
          const label = st.skills?.length
            ? st.skills.map(ctx.cmd).join(" + ")
            : st.label;
          const stage = st.stage ?? ctx.stageOf(st.skills?.[0]);
          return `<li class="${stageClass(stage)}"><span class="n">${k + 1}</span><div><b>${esc(label)}</b><span>${md(st.note)}</span></div></li>`;
        })
        .join("");
      return `
    <div class="session" role="tabpanel" id="panel-${esc(s.id)}" aria-labelledby="tab-${esc(s.id)}"${i === 0 ? "" : " hidden"}>
      <aside class="box rail ${stageClass(s.stage)}">
        <span class="eyebrow">Session ${i + 1} of ${list.length}</span>
        <h3>${esc(s.title)}</h3>
        <p>${md(s.blurb)}</p>
        <ol class="steps">${steps}</ol>
        <button class="replay" type="button">▶ Replay session</button>
      </aside>
      <div class="chat">
        <div class="chat-head"><span class="term-bar"><i></i><i></i><i></i></span><span>~/project · ${esc(s.title.toLowerCase())}</span></div>
        <div class="chat-body">${s.chat.map((m, k) => message(m, k, ctx)).join("")}</div>
      </div>
    </div>`;
    })
    .join("");

  return `
<section id="sessions" aria-labelledby="sessions-h">
  <div class="wrap">${secHead("sessions", head, ctx)}
    <div class="tabs" role="tablist" aria-label="Example sessions">${tabs}
    </div>${panels}
    <p class="note">${md(head.note)}</p>
  </div>
</section>`;
}
