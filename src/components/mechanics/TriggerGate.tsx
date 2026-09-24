import { startTransition, useState, ViewTransition } from 'react'
import { Mechanic } from './Mechanic'

const CODE = `// Ignored. A plain setState is not a transition.
setWide((w) => !w)

// Animated. Nothing else on this page works without it.
startTransition(() => setWide((w) => !w))`

/**
 * The gate every other card depends on. Same state, same element, same CSS —
 * the only difference is whether the update was marked as a transition.
 */
export function TriggerGate() {
  const [wide, setWide] = useState(false)

  return (
    <Mechanic
      id="trigger"
      tag="startTransition"
      title="The trigger gate"
      blurb="View transitions only run for async updates — a transition, useDeferredValue, an Action, or a Suspense reveal. A synchronous setState commits immediately and skips the animation entirely, which is the first thing to check when nothing moves."
      code={CODE}
      controls={
        <>
          <button type="button" className="mech-button" onClick={() => setWide((w) => !w)}>
            Plain setState
          </button>
          <button
            type="button"
            className="mech-button mech-button--go"
            onClick={() => startTransition(() => setWide((w) => !w))}
          >
            startTransition
          </button>
          <button type="button" className="mech-button" onClick={() => setWide(false)} disabled={!wide}>
            Reset
          </button>
        </>
      }
    >
      <ViewTransition name="mech-gate" default="mech-smooth">
        <div className={wide ? 'mech-bar mech-bar--wide' : 'mech-bar'}>{wide ? 'wide' : 'narrow'}</div>
      </ViewTransition>
    </Mechanic>
  )
}
