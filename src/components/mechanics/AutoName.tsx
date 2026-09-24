import { ViewTransition } from 'react'
import { useMechanic } from '../../lib/mechanics'
import { Mechanic } from './Mechanic'

const CODE = `// One wrapper, swapped children: the name survives, so it cross-fades.
<ViewTransition>
  {b ? <div key="b">B</div> : <div key="a">A</div>}
</ViewTransition>

// A wrapper each: two different names, so it is an exit plus an enter.
{b ? <ViewTransition key="b">…</ViewTransition>
   : <ViewTransition key="a">…</ViewTransition>}`

/**
 * `name` defaults to "auto", which is not the same as the browser's
 * `view-transition-name: auto`: React keeps the generated name attached to the
 * boundary, so swapping the DOM node inside it is an update, not a swap.
 */
export function AutoName() {
  const { value: b, play, reset, isInitial } = useMechanic(false)

  return (
    <Mechanic
      id="name"
      tag="name"
      title="name — where the boundary sits changes everything"
      blurb="Both lanes swap the same two elements on the same click. On the left one wrapper holds the name, so replacing the child is an update and the snapshots cross-fade. On the right each element has its own wrapper and therefore its own name, so the same swap becomes an exit and an enter."
      code={CODE}
      controls={
        <>
          <button type="button" className="mech-button mech-button--go" onClick={() => play((v) => !v)}>
            Swap
          </button>
          <button type="button" className="mech-button" onClick={reset} disabled={isInitial}>
            Reset
          </button>
        </>
      }
    >
      <div className="mech-pair">
        <div className="mech-lane">
          <span className="mech-lane__label">one wrapper</span>
          <div className="mech-lane__body">
            <ViewTransition default="mech-smooth">
              {b ? (
                <div key="b" className="mech-face mech-face--b">
                  B
                </div>
              ) : (
                <div key="a" className="mech-face mech-face--a">
                  A
                </div>
              )}
            </ViewTransition>
          </div>
        </div>

        <div className="mech-lane">
          <span className="mech-lane__label">a wrapper each</span>
          <div className="mech-lane__body">
            {b ? (
              <ViewTransition key="b" enter="mech-pop-in" exit="mech-pop-out">
                <div className="mech-face mech-face--b">B</div>
              </ViewTransition>
            ) : (
              <ViewTransition key="a" enter="mech-pop-in" exit="mech-pop-out">
                <div className="mech-face mech-face--a">A</div>
              </ViewTransition>
            )}
          </div>
        </div>
      </div>
    </Mechanic>
  )
}
