import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { Code, TextSlide } from './TextSlide'
import { RawStart } from '../basics/RawStart'
import { Lifecycle } from '../basics/Lifecycle'
import { NameMatching } from '../basics/NameMatching'
import { PseudoTree } from '../basics/PseudoTree'
import { StylingPseudos } from '../basics/StylingPseudos'
import { WhatReactAdds } from '../basics/WhatReactAdds'
import { TriggerGate } from '../mechanics/TriggerGate'
import { DeferredTrigger } from '../mechanics/DeferredTrigger'
import { EnterExit } from '../mechanics/EnterExit'
import { UpdateDemo } from '../mechanics/UpdateDemo'
import { ShareDemo } from '../mechanics/ShareDemo'
import { AutoName } from '../mechanics/AutoName'
import { DefaultClass } from '../mechanics/DefaultClass'
import { NoneOptOut } from '../mechanics/NoneOptOut'
import { TransitionTypes } from '../mechanics/TransitionTypes'
import { Nested } from '../mechanics/Nested'
import { Callbacks } from '../mechanics/Callbacks'

export type Slide = {
  /** URL segment: /present/:id */
  id: string
  /** Shown in the presenter header so the room knows where we are. */
  section: string
  render: () => ReactNode
}

const PART_BROWSER = '1 · The browser'
const PART_REACT = '2 · React'
const PART_TOGETHER = '3 · Together'

/**
 * The running order of the talk. Each demo slide renders exactly the same card
 * as the How it works / Mechanics pages, so what is presented is what ships.
 * To reorder the talk, reorder this array.
 */
export const SLIDES: Slide[] = [
  {
    id: 'title',
    section: 'Intro',
    render: () => (
      <TextSlide hero kicker="React" title="View Transitions">
        <p>The browser animates between two screenshots. React decides when to take them, and of what.</p>
        <p className="text-slide__hint">← → to move · + / − to zoom · Esc to leave</p>
      </TextSlide>
    ),
  },
  {
    id: 'part-browser',
    section: PART_BROWSER,
    render: () => (
      <TextSlide hero kicker="Part 1" title="The browser API">
        <p>No React yet. Everything React does later is built from these pieces.</p>
      </TextSlide>
    ),
  },
  { id: 'start-view-transition', section: PART_BROWSER, render: () => <RawStart /> },
  { id: 'lifecycle', section: PART_BROWSER, render: () => <Lifecycle /> },
  { id: 'view-transition-name', section: PART_BROWSER, render: () => <NameMatching /> },
  { id: 'pseudo-elements', section: PART_BROWSER, render: () => <PseudoTree /> },
  { id: 'css', section: PART_BROWSER, render: () => <StylingPseudos /> },
  {
    id: 'part-react',
    section: PART_REACT,
    render: () => (
      <TextSlide kicker="Part 2" title={<>What <code>&lt;ViewTransition&gt;</code> adds</>}>
        <Code>{`<ViewTransition name="card" enter="slide-in" exit="slide-out">
  <Card />
</ViewTransition>

startTransition(() => setOpen(true))`}</Code>
        <ul>
          <li>
            <strong>When</strong> — only for transition updates, and only at commit, once rendering is
            done. The frozen-frame window stays tiny.
          </li>
          <li>
            <strong>Names</strong> — a boundary gets a <code>view-transition-name</code> only while a
            transition runs, so names never collide at rest.
          </li>
          <li>
            <strong>Which case</strong> — React diffs the tree and classifies each boundary as{' '}
            <em>enter</em>, <em>exit</em>, <em>update</em> or <em>share</em>, then applies the matching{' '}
            <code>view-transition-class</code>.
          </li>
          <li>
            <strong>Why</strong> — <code>addTransitionType</code> lets the cause of an update choose the
            animation.
          </li>
        </ul>
      </TextSlide>
    ),
  },
  { id: 'react-layer', section: PART_REACT, render: () => <WhatReactAdds /> },
  { id: 'trigger', section: PART_REACT, render: () => <TriggerGate /> },
  { id: 'deferred', section: PART_REACT, render: () => <DeferredTrigger /> },
  { id: 'enter-exit', section: PART_REACT, render: () => <EnterExit /> },
  { id: 'update', section: PART_REACT, render: () => <UpdateDemo /> },
  { id: 'share', section: PART_REACT, render: () => <ShareDemo /> },
  { id: 'name', section: PART_REACT, render: () => <AutoName /> },
  { id: 'default', section: PART_REACT, render: () => <DefaultClass /> },
  { id: 'none', section: PART_REACT, render: () => <NoneOptOut /> },
  { id: 'types', section: PART_REACT, render: () => <TransitionTypes /> },
  { id: 'nested', section: PART_REACT, render: () => <Nested /> },
  { id: 'callbacks', section: PART_REACT, render: () => <Callbacks /> },
  {
    id: 'together',
    section: PART_TOGETHER,
    render: () => (
      <TextSlide kicker="Part 3" title="Putting it together">
        <ul>
          <li>
            <Link to="/">Simple</Link> — a card morphs into a detail view. Three names, one{' '}
            <code>startTransition</code>.
          </li>
          <li>
            <Link to="/gallery">Gallery</Link> — reordering, staged enter/exit, direction by transition
            type, and a shared element across a real route change.
          </li>
        </ul>
        <p className="text-slide__hint">
          The browser&apos;s back button returns here. This deck itself uses <code>addTransitionType</code>{' '}
          to slide left or right.
        </p>
      </TextSlide>
    ),
  },
  {
    id: 'gotchas',
    section: PART_TOGETHER,
    render: () => (
      <TextSlide kicker="Before you ship" title="Things that will bite">
        <ul>
          <li>
            <strong>Snapshots are pictures.</strong> By default they keep their aspect ratio and scale with
            the group&apos;s width, so text zooms and content spills out of the box when the shape changes.
            Setting <code>block-size: 100%</code> on old/new stretches them instead. Neither is free.
          </li>
          <li>
            <strong>Rendering pauses</strong> between the old capture and the DOM update, and the overlay
            sits over the page while it animates. Keep both short.
          </li>
          <li>
            <strong>Nested boundaries are separate groups.</strong> Give a parent and child the same
            timing or they drift apart mid-flight.
          </li>
          <li>
            <strong>Names must be unique at any instant.</strong> React manages this for its boundaries;
            a hand-written <code>view-transition-name</code> in CSS is on you.
          </li>
          <li>
            <strong>Reduced motion.</strong> Collapse the durations under{' '}
            <code>prefers-reduced-motion</code>.
          </li>
        </ul>
      </TextSlide>
    ),
  },
  {
    id: 'support',
    section: PART_TOGETHER,
    render: () => (
      <TextSlide kicker="Can I use it?" title="Support">
        <ul>
          <li>
            <strong>Same-document view transitions</strong> are Baseline: Chrome and Edge 111+, Safari 18+,
            Firefox 144+.
          </li>
          <li>
            <strong>Progressive by default.</strong> Without support the DOM still updates, it just does not
            animate.
          </li>
          <li>
            <strong><code>&lt;ViewTransition&gt;</code></strong> and <code>addTransitionType</code> are stable
            since <strong>React 19.3</strong> (September 2026). Before that they were canary and experimental
            only.
          </li>
        </ul>
      </TextSlide>
    ),
  },
  {
    id: 'end',
    section: 'Fin',
    render: () => (
      <TextSlide hero kicker="Thanks" title="Questions?">
        <p>
          Every demo is also on its own page: <Link to="/how-it-works">How it works</Link> ·{' '}
          <Link to="/mechanics">Mechanics</Link> · <Link to="/gallery">Gallery</Link>
        </p>
      </TextSlide>
    ),
  },
]
