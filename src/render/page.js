// Entry point used by vite.config.js at build time: data in, HTML sections out.

import { renderCatalog, renderFooter } from "./catalog.js";
import { renderDay } from "./day.js";
import { renderFlow } from "./flow.js";
import { renderHero, renderTopbar } from "./hero.js";
import { renderIcons } from "./icons.js";
import { renderLoop } from "./loop.js";
import { renderPicker } from "./picker.js";
import { renderSessions } from "./sessions.js";
import { createCtx } from "./util.js";

export function renderPage(data) {
  const ctx = createCtx(data);
  const { site } = data;
  const head = site.sections;
  return {
    icons: renderIcons(),
    topbar: renderTopbar(site, ctx),
    hero: renderHero(site, ctx),
    loop: renderLoop(data.loop, head.loop, ctx),
    flow: renderFlow(data.flow, head.flow, ctx),
    day: renderDay(data.day, head.day, ctx),
    sessions: renderSessions(data.sessions, head.sessions, ctx),
    picker: renderPicker(data.situations, head.picker, ctx),
    catalog: renderCatalog(site, head.catalog, ctx),
    footer: renderFooter(site, data),
  };
}
