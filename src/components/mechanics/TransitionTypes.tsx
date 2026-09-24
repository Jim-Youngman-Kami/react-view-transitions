import { addTransitionType, startTransition, useState, ViewTransition } from 'react'
import { Mechanic } from './Mechanic'

const STEPS = ['One', 'Two', 'Three', 'Four']

/**
 * Direction cannot be read off the DOM — only the click knows whether this is a
 * forward or a backward step. A class map keyed by transition type is how that
 * intent reaches CSS.
 */
const DIRECTIONAL = {
  enter: { 'mech-next': 'mech-in-right', 'mech-prev': 'mech-in-left', default: 'none' },
  exit: { 'mech-next': 'mech-out-left', 'mech-prev': 'mech-out-right', default: 'none' },
} as const

const CODE = `const DIRECTIONAL = {
  enter: { 'mech-next': 'mech-in-right', 'mech-prev': 'mech-in-left', default: 'none' },
  exit:  { 'mech-next': 'mech-out-left', 'mech-prev': 'mech-out-right', default: 'none' },
}

startTransition(() => {
  addTransitionType(\`mech-\${direction}\`)
  setIndex(next)
})`

export function TransitionTypes() {
  const [index, setIndex] = useState(0)

  const go = (direction: 'next' | 'prev') => {
    startTransition(() => {
      addTransitionType(`mech-${direction}`)
      setIndex((i) => (i + (direction === 'next' ? 1 : -1) + STEPS.length) % STEPS.length)
    })
  }

  return (
    <Mechanic
      id="types"
      tag="addTransitionType"
      title="Transition types — one update, several intents"
      blurb="enter, exit, share and update all accept an object keyed by transition type instead of a plain string, with a default entry as the fallback. addTransitionType tags the update from inside the transition, so the same component animates differently depending on why it changed. Stepping forward slides left; stepping back slides right."
      code={CODE}
      controls={
        <>
          <button type="button" className="mech-button mech-button--go" onClick={() => go('prev')}>
            ← Prev
          </button>
          <button type="button" className="mech-button mech-button--go" onClick={() => go('next')}>
            Next →
          </button>
          <button type="button" className="mech-button" onClick={() => setIndex(0)} disabled={index === 0}>
            Reset
          </button>
        </>
      }
    >
      {/* Keyed, so stepping is a genuine exit plus enter — the directional
          classes have no effect on an element that merely updated. */}
      <ViewTransition key={index} enter={DIRECTIONAL.enter} exit={DIRECTIONAL.exit}>
        <div className="mech-readout">{STEPS[index]}</div>
      </ViewTransition>
    </Mechanic>
  )
}
