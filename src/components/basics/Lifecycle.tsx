import { useRef, useState } from 'react'
import { holdAtMidpoint, startNamedTransition, viewTransitionAnimations } from '../../lib/vt'
import { Mechanic } from '../mechanics/Mechanic'
import './Basics.css'
import '../../basics-transitions.css'

type Entry = { at: number; label: string; detail: string }

const SLOW_MS = 800
const HOLD_MS = 1500

const CODE = `const vt = document.startViewTransition(async () => {
  // 1. Old state already captured. Rendering is paused until this resolves.
  await updateTheDOM()
})

await vt.updateCallbackDone  // 2. DOM is in its new state
await vt.ready               // 3. New state captured, pseudo-elements built, animating
await vt.finished            // 4. Pseudo-elements removed, the live page is back`

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))

/**
 * The four phases of a transition, timestamped from the promises on the object
 * that `startViewTransition` returns.
 */
export function Lifecycle() {
  const tile = useRef<HTMLDivElement>(null)
  const [log, setLog] = useState<Entry[]>([])
  const [slow, setSlow] = useState(false)
  const [hold, setHold] = useState(false)
  const [running, setRunning] = useState(false)

  const run = () => {
    const t0 = performance.now()
    const entries: Entry[] = []
    const push = (label: string, detail: string) => {
      entries.push({ at: Math.round(performance.now() - t0), label, detail })
      setLog([...entries])
    }

    push('startViewTransition()', 'called — the browser captures the old state first')

    const vt = startNamedTransition([[tile.current, 'basics-lifecycle']], async () => {
      push('update callback', 'running. The screen is frozen on the old snapshot')
      if (slow) await wait(SLOW_MS)
      const el = tile.current
      if (el) el.dataset.side = el.dataset.side === 'right' ? 'left' : 'right'
    })

    if (!vt) {
      push('unsupported', 'this browser has no View Transitions API; the DOM just changed')
      return
    }

    setRunning(true)
    void vt.updateCallbackDone.then(() => push('updateCallbackDone', 'the DOM is in its new state'))
    vt.ready
      .then(() => {
        push('ready', `new state captured, ${viewTransitionAnimations().length} pseudo-element animations running`)
        if (hold) holdAtMidpoint(HOLD_MS)
      })
      .catch((error: Error) => push('ready rejected', error.message))
    void vt.finished.finally(() => {
      push('finished', 'pseudo-elements removed, the live page is visible again')
      setRunning(false)
    })
  }

  return (
    <Mechanic
      id="lifecycle"
      tag="updateCallbackDone / ready / finished"
      title="Capture, update, animate"
      blurb="Every transition runs the same four steps, and the object startViewTransition returns has a promise for each. The important one is step 1: while your callback runs, rendering is paused and users see the old screenshot. Tick 'slow update' to feel it: that is why React only does this at commit time, once the new UI is ready."
      code={CODE}
      tall
      controls={
        <>
          <button type="button" className="mech-button mech-button--go" onClick={run} disabled={running}>
            Run transition
          </button>
          <label className="basics-check">
            <input type="checkbox" checked={slow} onChange={(event) => setSlow(event.target.checked)} />
            slow update ({SLOW_MS}ms)
          </label>
          <label className="basics-check">
            <input type="checkbox" checked={hold} onChange={(event) => setHold(event.target.checked)} />
            freeze at midpoint
          </label>
          <button type="button" className="mech-button" onClick={() => setLog([])} disabled={running || log.length === 0}>
            Clear
          </button>
        </>
      }
    >
      <div className="basics-split">
        <div className="basics-track basics-track--narrow">
          <div ref={tile} className="basics-tile basics-tile--named" data-side="left" />
        </div>

        {log.length === 0 ? (
          <span className="mech-log__empty">Run a transition to see its timeline.</span>
        ) : (
          <ol className="basics-timeline">
            {log.map((entry, index) => (
              <li className="basics-timeline__row" key={index}>
                <span className="basics-timeline__at">{entry.at}ms</span>
                <code className="basics-timeline__label">{entry.label}</code>
                <span className="basics-timeline__detail">{entry.detail}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </Mechanic>
  )
}
