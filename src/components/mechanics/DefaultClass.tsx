import { ViewTransition } from 'react'
import { useMechanic } from '../../lib/mechanics'
import { Mechanic } from './Mechanic'

const CODE = `<ViewTransition default="mech-quick">…</ViewTransition>
<ViewTransition default="mech-lag">…</ViewTransition>

/* The class is what CSS matches on, not the element. */
::view-transition-group(*.mech-lag) { animation-duration: 1400ms; }`

/**
 * `default` is the base class — it applies to whichever kind of animation ends
 * up happening (enter, exit, update or share) rather than to one of them.
 */
export function DefaultClass() {
  const { value: end, play, reset, isInitial } = useMechanic(false)

  return (
    <Mechanic
      id="default"
      tag="default"
      title="default — the base class"
      blurb="Sets view-transition-class on the element, which is what the *.class selectors in CSS match. It is combined with enter/exit/share/update rather than replaced by them, so it is where shared timing belongs. Both tiles below make the identical move; only the class differs."
      code={CODE}
      controls={
        <>
          <button type="button" className="mech-button mech-button--go" onClick={() => play((e) => !e)}>
            {end ? 'Move back' : 'Move'}
          </button>
          <button type="button" className="mech-button" onClick={reset} disabled={isInitial}>
            Reset
          </button>
        </>
      }
    >
      <div className="mech-pair">
        <div className="mech-lane">
          <span className="mech-lane__label">default=&quot;mech-quick&quot;</span>
          <div className="mech-track">
            <ViewTransition name="mech-default-quick" default="mech-quick">
              <div className={end ? 'mech-tile mech-tile--end' : 'mech-tile'} />
            </ViewTransition>
          </div>
        </div>

        <div className="mech-lane">
          <span className="mech-lane__label">default=&quot;mech-lag&quot;</span>
          <div className="mech-track">
            <ViewTransition name="mech-default-lag" default="mech-lag">
              <div className={end ? 'mech-tile mech-tile--lag mech-tile--end' : 'mech-tile mech-tile--lag'} />
            </ViewTransition>
          </div>
        </div>
      </div>
    </Mechanic>
  )
}
