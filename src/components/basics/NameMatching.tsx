import { useRef, useState } from 'react'
import { startNamedTransition } from '../../lib/vt'
import { Mechanic } from '../mechanics/Mechanic'
import './Basics.css'
import '../../basics-transitions.css'

const CODE = `named.style.viewTransitionName = 'basics-named'  // or in CSS

// Same name in the old and new screenshot = the same thing.
// The browser animates its position and size, not just its pixels.
const vt = document.startViewTransition(() => {
  plain.classList.toggle('right')
  named.classList.toggle('right')
})

// Cleared afterwards, so it is not dragged into unrelated transitions.
vt.finished.then(() => (named.style.viewTransitionName = ''))`

/**
 * `view-transition-name` is the identity the browser uses to match an element
 * across the two screenshots. Everything without one is part of `root`.
 */
export function NameMatching() {
  const plain = useRef<HTMLDivElement>(null)
  const named = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<string | null>(null)

  const flip = () => {
    for (const el of [plain.current, named.current]) {
      if (el) el.dataset.side = el.dataset.side === 'right' ? 'left' : 'right'
    }
  }

  const run = () => {
    setStatus(null)
    startNamedTransition([[named.current, 'basics-named']], flip)
  }

  const breakIt = () => {
    const vt = startNamedTransition(
      [
        [plain.current, 'basics-named'],
        [named.current, 'basics-named'],
      ],
      flip,
    )
    vt?.ready
      .then(() => setStatus('It animated?'))
      .catch((error: Error) => setStatus(`ready rejected — ${error.name}: ${error.message}`))
  }

  return (
    <Mechanic
      id="view-transition-name"
      tag="view-transition-name"
      title="Names are identity"
      blurb="Both boxes make the same move in the same transition. The left one has no name, so it is just pixels inside the root screenshot and cross-fades. The right one has a view-transition-name, so the browser pairs its old and new positions and animates between them. A name must be unique at any moment: give both boxes the same name and the whole transition is skipped, although the DOM still updates."
      code={CODE}
      controls={
        <>
          <button type="button" className="mech-button mech-button--go" onClick={run}>
            Move both
          </button>
          <button type="button" className="mech-button" onClick={breakIt}>
            Break it: duplicate the name
          </button>
        </>
      }
    >
      <div className="basics-stack">
        <div className="mech-pair">
          <div className="mech-lane">
            <span className="mech-lane__label">no name → part of root</span>
            <div className="basics-track">
              <div ref={plain} className="basics-tile" data-side="left" />
            </div>
          </div>
          <div className="mech-lane">
            <span className="mech-lane__label">view-transition-name</span>
            <div className="basics-track">
              <div
                ref={named}
                className="basics-tile basics-tile--named"
                data-side="left"
              />
            </div>
          </div>
        </div>
        <span className="basics-status">{status ?? '\u00a0'}</span>
      </div>
    </Mechanic>
  )
}
