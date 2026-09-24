import { useRef } from 'react'
import { startBrowserTransition } from '../../lib/vt'
import { Mechanic } from '../mechanics/Mechanic'
import './Basics.css'
import '../../basics-transitions.css'

const CODE = `// Plain DOM, no React, no names.
const flip = () => box.classList.toggle('right')

flip()                                   // snaps
document.startViewTransition(flip)       // cross-fades`

/**
 * The browser primitive with nothing layered on top. The element is moved by
 * writing to the DOM directly through a ref — React renders it once and never
 * touches `data-side` again — so there is no React involvement to explain away.
 */
export function RawStart() {
  const box = useRef<HTMLDivElement>(null)

  const flip = () => {
    const el = box.current
    if (el) el.dataset.side = el.dataset.side === 'right' ? 'left' : 'right'
  }

  return (
    <Mechanic
      id="raw"
      tag="document.startViewTransition"
      title="The browser primitive"
      blurb="The browser takes a screenshot of the page, runs your callback, takes another, and animates from one picture to the other. With no other instructions the default is a cross-fade of the entire page — notice the box fades out on the left and fades in on the right rather than travelling. Nothing here is React; the box is moved by editing the DOM directly."
      code={CODE}
      controls={
        <>
          <button type="button" className="mech-button" onClick={flip}>
            Mutate the DOM directly
          </button>
          <button type="button" className="mech-button mech-button--go" onClick={() => startBrowserTransition(flip)}>
            document.startViewTransition(mutate)
          </button>
        </>
      }
    >
      <div className="basics-track">
        <div ref={box} className="basics-tile" data-side="left" />
      </div>
    </Mechanic>
  )
}
