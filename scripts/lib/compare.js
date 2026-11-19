// Compares upstream skills with src/data/skills.json and checks content references.

/** Fields that come from upstream. Every other field (stage, short, …) is local and kept as is. */
export const UPSTREAM_FIELDS = [
  "category",
  "invocation",
  "path",
  "summary",
  "description",
];

export function diffSkills(local, upstream) {
  const localBy = new Map(local.map((s) => [s.name, s]));
  const upNames = new Set(upstream.map((s) => s.name));
  const added = [],
    changed = [];
  let unchanged = 0;
  for (const up of upstream) {
    const cur = localBy.get(up.name);
    if (!cur) {
      added.push(up);
      continue;
    }
    const fields = UPSTREAM_FIELDS.filter((f) => cur[f] !== up[f]).map((f) => ({
      field: f,
      from: cur[f],
      to: up[f],
    }));
    if (fields.length) changed.push({ name: up.name, fields });
    else unchanged++;
  }
  const removed = local.filter((s) => !upNames.has(s.name));
  return { added, removed, changed, unchanged };
}

/** Upstream order and fields; local fields kept; a new skill starts with stage "neutral". */
export function mergeSkills(local, upstream) {
  const localBy = new Map(local.map((s) => [s.name, s]));
  return upstream.map((up) => {
    const cur = localBy.get(up.name) ?? { stage: "neutral" };
    const localFields = Object.fromEntries(
      Object.entries(cur).filter(
        ([k]) => k !== "name" && !UPSTREAM_FIELDS.includes(k),
      ),
    );
    return {
      name: up.name,
      ...localFields,
      ...Object.fromEntries(UPSTREAM_FIELDS.map((f) => [f, up[f]])),
    };
  });
}

/** Every skill name the content JSON files mention, with where it is. */
export function collectRefs(content) {
  const refs = [];
  const add = (file, where, names) => {
    for (const name of names.filter(Boolean)) refs.push({ file, where, name });
  };

  add("site.json", "hero.floating", content.site.hero.floating);
  for (const s of content.loop.stages) {
    add("loop.json", `stage "${s.title}"`, [...s.skills, ...s.also]);
  }
  add("loop.json", "helpers", content.loop.helpers.skills);
  content.flow.events.forEach((e, i) => {
    add("flow.json", `events[${i}]`, [e.skill]);
  });
  for (const s of content.day.slots) {
    add("day.json", `slot ${s.time}`, [
      ...(s.skills ?? []),
      ...(s.also ?? []),
      ...(s.helpers ?? []),
    ]);
  }
  for (const se of content.sessions.sessions) {
    se.steps.forEach((st, i) => {
      add("sessions.json", `${se.id}.steps[${i}]`, st.skills ?? []);
    });
    se.chat.forEach((m, i) => {
      add(
        "sessions.json",
        `${se.id}.chat[${i}]`,
        (m.event ?? []).map((e) => e.skill),
      );
    });
  }
  content.situations.situations.forEach((s, i) => {
    add("situations.json", `[${i}] "${s.when}"`, [s.skill, ...s.then]);
  });
  return refs;
}
