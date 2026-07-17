# CSS Cursors

A library of 36 custom cursor effects built with CSS and a tiny universal
pointer tracker — magnetic rings, difference-blend discs, comet trails, gooey
metaballs, radar reticles, anaglyph splits and other lesser-seen tricks. No
frameworks, no dependencies, MIT licensed.

Live at https://csscursors.colorion.co — part of the
[Colorion](https://www.colorion.co) network.

## How it works

Custom cursors can't follow the mouse with CSS alone, so every demo is a `.cur`
box driven by a ~20-line vanilla-JS tracker that writes four inherited custom
properties as the pointer moves — `--x`, `--y`, `--angle` and `--speed`. The
real cursor is hidden (`cursor: none`) and CSS-positioned `.cursor` followers
chase the pointer. **All the character — lag, trailing, easing, squash — comes
from plain CSS transitions and keyframes; the JS only writes variables.**

- `src/data/cursors.ts` — the catalogue: one entry per cursor (index, name,
  CSS type key, and a one-line blurb used in the LLM prompt).
- `src/styles/global.css` — the site styles, the shared cursor plumbing
  (`@property` declarations + `.cur` / `.cursor` base), and every cursor,
  each documented with a numbered marker comment (`/* 01 Nib — … */`).
- `src/utils/cursorCss.ts` — at build time, slices `global.css` on those
  markers, prepends the shared plumbing, appends any referenced `@keyframes`,
  and produces self-contained copyable snippets (markup + CSS + tracker JS) and
  LLM prompts. `cursorMarkup()` is the single source of truth for each demo's
  HTML, used by both the live component and the snippet.
- `src/pages/cursor-data.json.ts` — emits the snippets + prompts as a static
  `/cursor-data.json`, fetched on demand when the copy modal first opens.
- `src/components/CursorDemo.astro` — renders each cursor's markup from
  `cursorMarkup()`.
- `src/pages/index.astro` — hosts the tracker, the lazy-reveal grid and the
  copy modal (which re-binds the tracker to the cloned preview).

Every cursor paints with two colour tokens so a copied snippet can be re-skinned
by overriding them: `--ink-2` (primary accent) and `--ink-3` (secondary accent),
plus `--ink` for underlying content. All ambient animations respect
`prefers-reduced-motion`.

## Commands

| Command           | Action                                      |
| :---------------- | :------------------------------------------ |
| `npm install`     | Install dependencies                        |
| `npm run dev`     | Start local dev server at `localhost:4321`  |
| `npm run build`   | Build the production site to `./dist/`      |
| `npm run preview` | Preview the build locally                   |

## Adding a cursor

1. Add its CSS to `global.css` inside the cursors section with the next
   numbered marker comment; scope rules to `.cur-<type> .cursor` and prefix any
   keyframes with `cur-`.
2. Add the entry to `src/data/cursors.ts` (and to `segmentCounts` if it renders
   a chain of followers, or `showsWord` if it acts on underlying content).
3. If it needs bespoke markup, extend `cursorMarkup()` in `cursorCss.ts` — it is
   the single source the live demo and the copyable snippet both render from.
