import { ViewTransition } from 'react'
import { useMechanic } from '../../lib/mechanics'
import { Mechanic } from './Mechanic'

const CODE = `<ViewTransition enter="mech-pop-in" exit="mech-pop-out">…</ViewTransition>

// "none" deactivates the view-transition-name under that condition,
// so this one has no snapshot to animate and simply appears.
<ViewTransition enter="none" exit="none">…</ViewTransition>`

/**
 * `"none"` is a reserved value rather than a class you define. It switches the
 * view transition name off for that condition, which opts the element out.
 */
export function NoneOptOut() {
  const { value: shown, play, reset, isInitial } = useMechanic(false)

  return (
    <Mechanic
      id="none"
      tag='"none"'
      title="none — opting a condition out"
      blurb="All three chips mount and unmount together. The grey one passes none to enter and exit, which switches its view transition name off for those conditions, so it snaps in and out while its neighbours animate. Useful for elements that would otherwise be dragged along by a transition they have nothing to do with."
      code={CODE}
      controls={
        <>
          <button type="button" className="mech-button mech-button--go" onClick={() => play((s) => !s)}>
            {shown ? 'Remove all three' : 'Add all three'}
          </button>
          <button type="button" className="mech-button" onClick={reset} disabled={isInitial}>
            Reset
          </button>
        </>
      }
    >
      <div className="mech-row">
        {shown && (
          <>
            <ViewTransition enter="mech-pop-in" exit="mech-pop-out">
              <div className="mech-chip">animated</div>
            </ViewTransition>
            <ViewTransition enter="none" exit="none">
              <div className="mech-chip mech-chip--muted">none</div>
            </ViewTransition>
            <ViewTransition enter="mech-pop-in" exit="mech-pop-out">
              <div className="mech-chip mech-chip--alt">animated</div>
            </ViewTransition>
          </>
        )}
      </div>
    </Mechanic>
  )
}
