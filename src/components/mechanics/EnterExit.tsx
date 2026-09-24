import { ViewTransition } from 'react'
import { useMechanic } from '../../lib/mechanics'
import { Mechanic } from './Mechanic'

const CODE = `{shown && (
  <ViewTransition enter="mech-pop-in" exit="mech-pop-out">
    <div className="mech-chip">I was added</div>
  </ViewTransition>
)}`

/**
 * The add/remove pair. Conditionally rendering the whole `<ViewTransition>`
 * rather than its children is what makes this a real mount and unmount.
 */
export function EnterExit() {
  const { value: shown, play, reset, isInitial } = useMechanic(false)

  return (
    <Mechanic
      id="enter-exit"
      tag="enter / exit"
      title="enter and exit — one side only"
      blurb="enter applies when the element mounts and nothing with the same name is leaving; exit when it unmounts and nothing with that name is arriving. Because only one snapshot exists, these rules need mix-blend-mode: normal (there is nothing to cross-fade against) and animation-fill-mode: both (the snapshot must hold its last frame for the rest of the transition)."
      code={CODE}
      controls={
        <>
          <button type="button" className="mech-button mech-button--go" onClick={() => play((s) => !s)}>
            {shown ? 'Remove (exit)' : 'Add (enter)'}
          </button>
          <button type="button" className="mech-button" onClick={reset} disabled={isInitial}>
            Reset
          </button>
        </>
      }
    >
      <div className="mech-row">
        {shown && (
          <ViewTransition enter="mech-pop-in" exit="mech-pop-out">
            <div className="mech-chip">I was added</div>
          </ViewTransition>
        )}
      </div>
    </Mechanic>
  )
}
