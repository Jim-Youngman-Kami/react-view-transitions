import { useDeferredValue, useState, ViewTransition } from 'react'
import { Mechanic } from './Mechanic'

const STAGES = ['Queued', 'Building', 'Testing', 'Deployed']

const CODE = `const [value, setValue] = useState(0)
const deferred = useDeferredValue(value)

// A plain setState — but the deferred re-render is async,
// and that is what the view transition attaches to.
setValue(next)

<ViewTransition update="mech-roll">{STAGES[deferred]}</ViewTransition>`

/**
 * `startTransition` is the usual trigger but not the only one. Anything that
 * makes the update async qualifies, and `useDeferredValue` is the smallest
 * example that does not involve routing or data fetching.
 */
export function DeferredTrigger() {
  const [value, setValue] = useState(0)
  const deferred = useDeferredValue(value)

  return (
    <Mechanic
      id="deferred"
      tag="useDeferredValue"
      title="Other triggers, not just startTransition"
      blurb="The click here is an ordinary setState, yet it animates — because the element renders the deferred value, and React re-renders that asynchronously. Actions and a Suspense boundary revealing content instead of its fallback qualify the same way. Reset animates too on this card, for exactly the same reason."
      code={CODE}
      controls={
        <>
          <button
            type="button"
            className="mech-button mech-button--go"
            onClick={() => setValue((v) => (v + 1) % STAGES.length)}
          >
            Advance stage
          </button>
          <button type="button" className="mech-button" onClick={() => setValue(0)} disabled={value === 0}>
            Reset
          </button>
        </>
      }
    >
      <ViewTransition name="mech-deferred" default="mech-smooth" update="mech-roll">
        <div className="mech-readout">{STAGES[deferred]}</div>
      </ViewTransition>
    </Mechanic>
  )
}
