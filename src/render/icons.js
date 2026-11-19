// Icon sprite. Reference with <svg><use href="#i-NAME"/></svg>.
const g = (d) =>
  `<g fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">${d}</g>`;

export const ICONS = {
  align: g(
    '<path d="M6 10h24v16H16l-6 6v-6H6z"/><path d="M30 18h12v16h-4v6l-6-6h-10v-8"/><path d="M15 15.5a3 3 0 1 1 3.4 3c-.6.1-.9.6-.9 1.2"/><circle cx="17.5" cy="23" r=".4" fill="currentColor"/>',
  ),
  plan: g(
    '<rect x="9" y="6" width="30" height="36" rx="4"/><path d="M15 16l3 3 5-6M27 16h6M15 27l3 3 5-6M27 27h6M15 36h18"/>',
  ),
  build: g(
    '<rect x="6" y="26" width="16" height="14" rx="2"/><rect x="26" y="26" width="16" height="14" rx="2"/><rect x="16" y="9" width="16" height="14" rx="2"/>',
  ),
  debug: g(
    '<rect x="15" y="14" width="18" height="26" rx="9"/><path d="M19 14a5 5 0 0 1 10 0M24 22v18M15 24H7M33 24h8M15 33l-7 4M33 33l7 4M16 17l-6-5M32 17l6-5"/>',
  ),
  ship: g('<path d="M42 6 6 21l14 6 6 14z"/><path d="M42 6 20 27"/>'),
  reflect: g(
    '<path d="M38 20A15 15 0 0 0 10 17"/><path d="M10 8v9h9"/><path d="M10 28a15 15 0 0 0 28 3"/><path d="M38 40v-9h-9"/>',
  ),
  setup: g(
    '<circle cx="24" cy="24" r="6"/><path d="M24 5v6M24 37v6M5 24h6M37 24h6M10.6 10.6l4.2 4.2M33.2 33.2l4.2 4.2M10.6 37.4l4.2-4.2M33.2 14.8l4.2-4.2"/>',
  ),
  moon: g(
    '<path d="M34 32A15 15 0 0 1 20 9a15 15 0 1 0 19 19 15 15 0 0 1-5 4z"/><path d="M36 8v6M33 11h6"/>',
  ),
  map: g(
    '<path d="M6 12l11-5 14 5 11-5v29l-11 5-14-5-11 5z"/><path d="M17 7v29M31 12v29"/>',
  ),
};

export const icon = (name) =>
  `<svg aria-hidden="true"><use href="#i-${ICONS[name] ? name : "build"}"/></svg>`;

export const renderIcons = () =>
  `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>${Object.entries(
    ICONS,
  )
    .map(
      ([n, body]) => `<symbol id="i-${n}" viewBox="0 0 48 48">${body}</symbol>`,
    )
    .join("")}</defs></svg>`;
