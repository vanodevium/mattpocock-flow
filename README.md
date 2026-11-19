# A Day with Skills

An illustrated daily workflow for [mattpocock/skills](https://github.com/mattpocock/skills).
Content lives in JSON, design lives in templates and CSS, and the build keeps the skill list in sync with the upstream repo.

```bash
npm install
npm run dev          # local dev server; reload the page after JSON edits, restart after template edits
npm run build        # sync skills.json with upstream, then build dist/index.html (single file)
```

## Where things live

| Change this…                                         | …by editing                         |
| ---------------------------------------------------- | ----------------------------------- |
| Skill list (synced, don't hand-edit upstream fields) | `src/data/skills.json`              |
| Hero, nav, section headings, footer                  | `src/data/site.json`                |
| The five-stop loop + helpers                         | `src/data/loop.json`                |
| Hour-by-hour day                                     | `src/data/day.json`                 |
| Example sessions                                     | `src/data/sessions.json`            |
| "Which skill?" picker                                | `src/data/situations.json`          |
| Markup of a section                                  | `src/render/<section>.js`           |
| Colours, fonts, theme                                | `src/styles/tokens.css`             |
| Look of a section                                    | `src/styles/sections/<section>.css` |
| Behaviour (tabs, picker, copy)                       | `src/main.js`                       |

Content strings support `` `code` `` and `**bold**`. Skills are referenced by bare name (`"to-spec"`); the page adds the `/` for user-invoked skills and colours each chip by the skill's `stage`.

## Skill sync

`scripts/sync-skills.js` reads the upstream repo:

- **which skills exist**: `.claude-plugin/plugin.json` (what actually ships)
- **user- vs model-invoked**: `disable-model-invocation: true` in each `SKILL.md`
- **summary**: the skill's line in `skills/<category>/README.md`
- **description**: `SKILL.md` frontmatter

It then prints a report: `+ added`, `- removed`, `~ changed` (field by field), and writes `skills.json`.

In `skills.json`, `category`, `invocation`, `path`, `summary` and `description` come from upstream and get overwritten. Every other field (`stage`, `short`, anything you add) is local and is never touched. A new upstream skill arrives with `stage: "neutral"`; give it a `stage` and `short`.

After syncing, it checks that every skill named in the content JSON still exists. A broken reference (e.g. a skill renamed upstream) stops the build and names the file and entry.

`npm run sync` runs only the sync. The sync needs network access to GitHub; without it the build fails.

Stage values: `align`, `plan`, `build`, `debug`, `ship`, `reflect`, `neutral`.
