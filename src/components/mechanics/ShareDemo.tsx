import { ViewTransition } from 'react'
import { useMechanic } from '../../lib/mechanics'
import { Mechanic } from './Mechanic'

const SLOTS = [0, 1, 2]

const CODE = `{SLOTS.map((slot) => (
  <div className="mech-slot" key={slot}>
    {at === slot && (
      // Same name in every slot — only one is ever mounted.
      <ViewTransition name="mech-shared-orb" share="mech-glide">
        <div className="mech-orb" />
      </ViewTransition>
    )}
  </div>
))}`

/**
 * The shared-element case. One `<ViewTransition>` unmounts and another with the
 * same `name` mounts in the same update, so React pairs them instead of running
 * an exit and an unrelated enter.
 */
export function ShareDemo() {
  const { value: at, play, reset, isInitial } = useMechanic(0)

  return (
    <Mechanic
      id="share"
      tag="share"
      title="share — matched by name across the tree"
      blurb="This is the morph. The two elements are in completely different places in the tree; the matching name is the only thing connecting them, and it turns what would have been an exit plus an enter into one element travelling. Without the shared name you would see the orb vanish on the left and pop in on the right."
      code={CODE}
      controls={
        <>
          <button
            type="button"
            className="mech-button mech-button--go"
            onClick={() => play((slot) => (slot + 1) % SLOTS.length)}
          >
            Move to next slot
          </button>
          <button type="button" className="mech-button" onClick={reset} disabled={isInitial}>
            Reset
          </button>
        </>
      }
    >
      <div className="mech-slots">
        {SLOTS.map((slot) => (
          <div className="mech-slot" key={slot}>
            {at === slot && (
              <ViewTransition name="mech-shared-orb" share="mech-glide">
                <div className="mech-orb" />
              </ViewTransition>
            )}
          </div>
        ))}
      </div>
    </Mechanic>
  )
}
