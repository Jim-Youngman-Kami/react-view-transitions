import { startTransition, useEffect, useRef, useState, ViewTransition } from 'react'
import { supportsViewTransitions, viewTransitionAnimations } from '../../lib/vt'
import { Mechanic } from '../mechanics/Mechanic'
import './Basics.css'
import '../../basics-transitions.css'

type Entry = { step: string; detail: string }

const CODE = `// What you write
<ViewTransition>{/* auto name */}<Chip /></ViewTransition>
<ViewTransition name="react-named"><Chip /></ViewTransition>

startTransition(() => setMoved((m) => !m))

// What React does at commit, roughly
document.startViewTransition({ update: commitMutations, types })`

const describeArgument = (arg: unknown) => {
  if (typeof arg === 'function') return 'startViewTransition(callback)'
  if (arg && typeof arg === 'object') {
    const types = (arg as { types?: unknown }).types
    const keys = Object.keys(arg).join(', ')
    const typeList = Array.isArray(types) ? ` types=[${types.join(', ')}]` : ''
    return `startViewTransition({ ${keys} })${typeList}`
  }
  return 'startViewTransition()'
}

const readName = (el: HTMLElement | null) => (el ? el.style.viewTransitionName || '(none)' : '(unmounted)')

/**
 * Proves that `<ViewTransition>` is a layer over the same browser API: a spy on
 * `document.startViewTransition` catches React calling it, and the callbacks
 * read back which names React assigned while the transition ran.
 */
export function WhatReactAdds() {
  const [moved, setMoved] = useState(false)
  const [log, setLog] = useState<Entry[]>([])
  const armed = useRef(false)
  const entries = useRef<Entry[]>([])
  const autoChip = useRef<HTMLDivElement>(null)
  const namedChip = useRef<HTMLDivElement>(null)

  const push = (step: string, detail: string) => {
    entries.current = [...entries.current, { step, detail }]
    setLog(entries.current)
  }

  useEffect(() => {
    if (!supportsViewTransitions()) return
    const original = document.startViewTransition
    const spy = function (this: Document, arg?: Parameters<typeof original>[0]) {
      const vt = original.call(this, arg)
      if (armed.current) {
        armed.current = false
        push('React →', describeArgument(arg))
        void vt.finished.finally(() =>
          push('finished', `names removed again: auto=${readName(autoChip.current)} named=${readName(namedChip.current)}`),
        )
      }
      return vt
    } as typeof original
    document.startViewTransition = spy
    return () => {
      document.startViewTransition = original
    }
  }, [])

  // Fires once the animations exist, so the pseudo-elements can be read back.
  const onAnimate = () => {
    const names = [...new Set(viewTransitionAnimations().map((entry) => entry.name))].filter(
      (name) => name !== 'root',
    )
    push('during', `view-transition-name: auto=${readName(autoChip.current)} named=${readName(namedChip.current)}`)
    push('groups', names.map((name) => `group(${name})`).join('  '))
  }

  const run = () => {
    entries.current = []
    setLog([])
    push('you', `startTransition(() => setMoved(${!moved}))`)
    push('at rest', `view-transition-name: auto=${readName(autoChip.current)} named=${readName(namedChip.current)}`)
    armed.current = true
    startTransition(() => setMoved((m) => !m))
  }

  const reset = () => {
    setMoved(false)
    entries.current = []
    setLog([])
  }

  const chipClass = moved ? 'mech-chip basics-chip basics-chip--moved' : 'mech-chip basics-chip'

  return (
    <Mechanic
      id="react-layer"
      tag="<ViewTransition>"
      title="What React adds on top"
      blurb="Same browser API, called by React at commit time and only for transition updates. React gives each affected boundary a view-transition-name for the length of the transition and removes it afterwards, so names never collide at rest. The log is captured live by spying on document.startViewTransition."
      code={CODE}
      tall
      controls={
        <>
          <button type="button" className="mech-button mech-button--go" onClick={run}>
            startTransition
          </button>
          <button type="button" className="mech-button" onClick={reset} disabled={!moved && log.length === 0}>
            Reset
          </button>
        </>
      }
    >
      <div className="basics-split">
        <div className="basics-chips">
          <ViewTransition default="mech-smooth" onUpdate={onAnimate}>
            <div ref={autoChip} className={chipClass}>
              auto
            </div>
          </ViewTransition>
          <ViewTransition name="react-named" default="mech-smooth">
            <div ref={namedChip} className={`${chipClass} mech-chip--alt`}>
              react-named
            </div>
          </ViewTransition>
        </div>

        {log.length === 0 ? (
          <span className="mech-log__empty">Run a transition to watch React drive the browser API.</span>
        ) : (
          <ol className="basics-timeline">
            {log.map((entry, index) => (
              <li className="basics-timeline__row basics-timeline__row--wide" key={index}>
                <code className="basics-timeline__label">{entry.step}</code>
                <span className="basics-timeline__detail">{entry.detail}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </Mechanic>
  )
}
