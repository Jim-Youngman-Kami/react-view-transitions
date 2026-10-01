# React `<ViewTransition>`

Demos of React's `<ViewTransition>` component (stable since React 19.3) and the browser API
underneath it, in TypeScript, on separate routes, plus a slide deck for
presenting them.

| Route | What it shows |
| --- | --- |
| `/` — **Simple** | One idea: a card morphs into a detail view and back. |
| `/gallery` — **Gallery** | Reordering, enter/exit, direction-aware navigation, and shared elements across a real route change. |
| `/how-it-works` — **How it works** | The browser API with no React: `startViewTransition`, the capture → update → animate lifecycle, `view-transition-name`, the live pseudo-element tree, CSS styling, and what React layers on top. |
| `/mechanics` — **Mechanics** | React's API taken apart, one prop or trigger per card. |
| `/present/:slide` — **Present** | Full-window deck that walks through all of the above in order. |
| `/scratch` | A bare sandbox for live-coding; not in the tab bar. |

## Run

```bash
pnpm install
pnpm dev
```

`pnpm build` typechecks (`tsc --noEmit`) before bundling; `pnpm typecheck`
runs it on its own.

Both demos share a speed slider pinned to the bottom of the window, from 0.1× to
4×. Every duration in `view-transitions.css` is written as a multiple of a single
`--vt-scale` custom property, so the slider only sets that one value:

```css
:root {
  --vt-scale: 1;
  --vt-gallery-move: calc(420ms * var(--vt-scale));
}
```

This works because custom properties are inherited and the pseudo-element tree is
attached to the document element, so `--vt-scale` set on `:root` reaches
`::view-transition-group()` and friends. Scaling one variable rather than
overriding durations wholesale keeps the staged timings in proportion — at 0.25×
the tile move, the entrance, and the entrance's delay all stretch by exactly 4×.

## Presenting

Open `/present` (or the **Present ▸** tab). The deck is three parts:
**the browser API** (the How it works cards), **React** (what `<ViewTransition>`
adds, then every Mechanics card), and **putting it together** (links to the two
full demos, gotchas, support). Each demo slide renders the same card component
as its page, so every demo still runs on its own there.

| Key | Action |
| --- | --- |
| `→` / `PageDown` · `←` / `PageUp` | Next / previous slide (works with most clickers) |
| `Home` / `End` | First / last slide |
| `+` / `-` / `0` | Zoom in / out / reset (saved in `localStorage`) |
| `Esc` | Leave the deck |

Slides are laid out at 1000px wide and zoomed to fit the window, so they scale
up on a projector. The speed slider is on every slide. The deck uses the API it
presents: slide changes are `startTransition` + `addTransitionType('present-next'
| 'present-prev')`, and the progress bar is a named `<ViewTransition>`. To
reorder or cut slides, edit the `SLIDES` array in
`src/components/present/slides.tsx`.

## The three rules

1. **React 19.3 or later.** `<ViewTransition>` and `addTransitionType` became
   stable in React 19.3 (September 2026). Earlier versions only had them in the
   canary and experimental channels.
2. **A matching `name`.** Two elements with the same `name` on either side of an
   update are matched by React and animated between their positions and sizes.
3. **An update inside a transition.** View transitions only run for updates
   marked as transitions — `startTransition(...)`. A plain `setState` swaps
   instantly with no animation. React Router `<Link>` and `navigate()` already
   qualify, which is why route changes animate without any extra opt-in. The
   browser's own back and forward buttons do not: they change the route without
   a view transition.

## Demo 1 — Simple

Three named transitions: the `card-*` panel morph, the `title-*` label nested
inside it, and the `heading`, which moves from centred to top-left and shrinks.

The label is nested *inside* the card's `<ViewTransition>`, which lifts it out of
the card's snapshot so it scales on its own rather than being stretched along
with the panel.

## Demo 2 — Gallery

Adds the parts of the API that have no plain-CSS equivalent.

**Reordering.** Filtering and sorting rewrite the URL's search params. Every tile
keeps its `name`, so React animates each one from its old position to its new one.

**Enter and exit.** `default` is the *base* class, applied whenever the element
animates. `enter` and `exit` are combined with it, but only when the element is
added or removed — so tiles that get filtered out pop away while the survivors
slide:

```tsx
<ViewTransition name={creatureName(id)} default="gallery-move" enter="tile-enter" exit="tile-exit">
```

The three roles are staged rather than run together, which matters more than it
sounds. Firing them simultaneously leaves the removed tiles sitting at full size
on top of the survivors that are moving into their place, so the grid looks like
it is waiting for them. Leavers now collapse over the first 200ms, the survivors
take the full 420ms to close the gap, and the joiners are held back 180ms so they
land in a settled grid. The easing matters too: an `ease-in` exit starts slow, so
the tile holds at full opacity and then vanishes abruptly.

**Direction-aware navigation.** Nothing in the DOM says whether "next" means
left or right — only the click knows. `addTransitionType` tags the update, and
the class props select an animation per type:

```tsx
startTransition(() => {
  addTransitionType(`nav-${direction}`) // 'nav-next' | 'nav-prev'
  navigate(`/gallery/${target.id}`)
})
```

```tsx
enter={{ 'nav-next': 'enter-right', 'nav-prev': 'enter-left', default: 'none' }}
exit={{ 'nav-next': 'exit-left', 'nav-prev': 'exit-right', default: 'none' }}
```

**Shared elements across a route change.** `/gallery` and `/gallery/:id` are
sibling routes, so the grid unmounts entirely. Because the opened tile and the
detail panel share a `name`, React treats it as a *share* rather than an
exit plus an enter, and morphs one into the other.

All of these resolve to the CSS `view-transition-class` property, which is what
the `*.class-name` selectors in `src/view-transitions.css` match.

## How it works — the browser underneath

These cards call `document.startViewTransition` directly and move elements by
writing to the DOM through refs, so no React is involved. Their elements get a
`view-transition-name` only while their own transition runs
(`startNamedTransition` in `src/lib/vt.ts`). A permanent name would pull each
card into every other card's transitions. Naming on demand like this is also
what React does for its boundaries.

The pseudo-element tree and the lifecycle counts are read live from
`document.getAnimations()`: every `::view-transition-*` animation is a normal Web
Animation whose effect names the pseudo-element it targets. The last card
temporarily wraps `document.startViewTransition` in a spy, which is how it shows
React calling `startViewTransition({ update, types })` and the auto-generated
names it assigns.

## Two gotchas worth knowing

**Snapshots keep their own aspect ratio.** By default each snapshot is laid out
as `inline-size: 100%; block-size: auto`, so a square card can only *scale up* —
it never changes shape. Giving the snapshots the group's height makes them
stretch to the animating box:

```css
::view-transition-old(*),
::view-transition-new(*) {
  block-size: 100%;
}
```

Related: an element whose box is full-width in both states can only change
height, which squashes the snapshot. That is why `.heading` is
`display: inline-block` — so its box hugs the text and can actually morph.

**Nested elements are separate groups.** A tile and the label inside it animate
independently. If only one of them carries a duration override, the two visibly
drift apart mid-flight. Anything that should move as a unit needs the same
timing — hence the single `gallery-move` class on both.

## Project structure

```
src/
  main.tsx                 router setup
  App.tsx                  shell: tab bar (a shared `tab-pill`) + <Outlet>
  view-transitions.css     global ::view-transition-* rules and animation classes
  mechanics-transitions.css  pseudo-element rules for the Mechanics cards
  basics-transitions.css   pseudo-element rules for the How it works cards
  index.css                reset / page background
  lib/
    cards.ts               simple demo data + transition-name helpers
    gallery.ts             gallery data, filter/sort, and its name helpers
    mechanics.ts           useMechanic: animated play, un-animated reset
    vt.ts                  raw browser API helpers: start, name-on-demand, read pseudo animations
  routes/
    SimpleDemo.tsx         demo 1
    Gallery.tsx            demo 2, the grid
    GalleryItem.tsx        demo 2, the detail route
    HowItWorks.tsx         the browser API cards
    Mechanics.tsx          the React API cards
    Present.tsx            the slide deck: keyboard, zoom-to-fit, slide motion
    Scratch.tsx            live-coding sandbox
  components/
    Heading.tsx  CardGrid.tsx  CardTile.tsx  CardDetail.tsx  CardTitle.tsx
    SpeedControl.tsx       the 0.1x-4x slider, drives --vt-scale
    gallery/
      GalleryToolbar.tsx   filter and sort chips
      GalleryTile.tsx      one tile
    basics/                one card per browser-API concept
    mechanics/             one card per React prop/trigger, plus the shared Mechanic shell
    present/
      slides.tsx           the running order of the talk
      TextSlide.tsx        title / bullet slides
```

Each component imports its own stylesheet. Because a transition only fires when
the *same* `name` appears on both sides of an update, and those sides live in
different files, names are built by helpers in `lib/` rather than typed as
strings in each component.

To add a card or a creature, append to `CARDS` or `CREATURES` — nothing else needs
to change.

## Browser support

Needs a browser with the View Transitions API (Chrome/Edge 111+, Safari 18+,
Firefox 144+); the `view-transition-class` selectors need Chrome 125+, Safari
18.2+ or Firefox 144+. Elsewhere every demo still works, it just cuts between views without
animating. Present from Chrome: that is where the deck was verified.
Transitions are reduced to 1ms under `prefers-reduced-motion`.
