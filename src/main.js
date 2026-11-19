// Client-side behaviour only. All content is already in the HTML (prerendered at build time).
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/components.css";
import "./styles/sections/hero.css";
import "./styles/sections/loop.css";
import "./styles/sections/flow.css";
import "./styles/sections/day.css";
import "./styles/sections/sessions.css";
import "./styles/sections/picker.css";
import "./styles/sections/catalog.css";

const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* copy buttons */
for (const btn of $$(".copy")) {
  btn.addEventListener("click", () => {
    const el = document.getElementById(btn.dataset.copy);
    const flash = (t) => {
      btn.textContent = t;
      setTimeout(() => (btn.textContent = "Copy"), 1400);
    };
    const fallback = () => {
      const r = document.createRange();
      r.selectNodeContents(el);
      const s = getSelection();
      s.removeAllRanges();
      s.addRange(r);
      flash("Selected");
    };
    try {
      navigator.clipboard
        .writeText(el.textContent)
        .then(() => flash("Copied"), fallback);
    } catch {
      fallback();
    }
  });
}

/* sessions: tabs + replay */
const tabs = $$(".tab[data-session]");
const replay = (panel) => {
  const body = panel.querySelector(".chat-body");
  body.classList.remove("play");
  void body.offsetWidth;
  body.classList.add("play");
};
function show(id, animate = true) {
  for (const t of tabs) {
    const on = t.dataset.session === id;
    t.setAttribute("aria-selected", on);
    t.tabIndex = on ? 0 : -1;
    const panel = document.getElementById(t.getAttribute("aria-controls"));
    panel.hidden = !on;
    if (on && animate) replay(panel);
  }
}
tabs.forEach((t, i) => {
  t.addEventListener("click", () => {
    show(t.dataset.session);
    try {
      history.replaceState(null, "", `#${t.dataset.session}`);
    } catch {
      /* sandboxed */
    }
  });
  t.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const next =
      tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
    show(next.dataset.session);
    next.focus();
  });
});
for (const b of $$(".replay"))
  b.addEventListener("click", () => replay(b.closest(".session")));
const fromHash = () =>
  tabs.find((t) => `#${t.dataset.session}` === location.hash);
if (fromHash()) {
  show(fromHash().dataset.session, false);
  document.getElementById("sessions").scrollIntoView();
}
addEventListener(
  "hashchange",
  () => fromHash() && show(fromHash().dataset.session),
);

/* picker */
const picks = $$(".sit[data-pick]");
for (const b of picks) {
  b.addEventListener("click", () => {
    for (const o of picks) o.setAttribute("aria-pressed", o === b);
    for (const a of $$("[data-answer]"))
      a.hidden = a.dataset.answer !== b.dataset.pick;
  });
}
