import { useRef, useState, ViewTransition } from 'react'
import type { ViewTransitionInstance } from 'react'
import { startTransition } from 'react'
import { Mechanic } from './Mechanic'

type Placement = { at: 0 | 1 | null; label: string }
type LogEntry = { id: number; kind: string; detail: string }

const INITIAL: Placement = { at: 0, label: 'alpha' }
const LABELS = ['alpha', 'beta', 'gamma']
const LIMIT = 8

const CODE = `<ViewTransition
  name="mech-callbacks"
  onEnter={record('onEnter')}
  onExit={record('onExit')}
  onShare={record('onShare')}
  onUpdate={record('onUpdate')}
>`

export function Callbacks() {
  const [placement, setPlacement] = useState<Placement>(INITIAL)
  const [log, setLog] = useState<LogEntry[]>([])
  const nextId = useRef(0)

  const record =
    (kind: string) => (instance: ViewTransitionInstance, types: Array<string>) => {
      // Appended with a plain setState, and the log is rendered outside every
      // ViewTransition on this card. Both matter: if the log were inside a
      // boundary, writing to it would be content changing, and `onUpdate` would
      // fire on its own output forever.
      setLog((prev) =>
        [
          {
            id: nextId.current++,
            kind,
            detail: `name=${instance.name} types=[${types.join(', ')}]`,
          },
          ...prev,
        ].slice(0, LIMIT),
      )
    }

  const play = (next: Placement) => startTransition(() => setPlacement(next))

  const reset = () => {
    setPlacement(INITIAL)
    setLog([])
  }

  const mounted = placement.at !== null
  const isInitial = placement.at === INITIAL.at && placement.label === INITIAL.label

  return (
    <Mechanic
      id="callbacks"
      tag="onEnter / onExit / onShare / onUpdate"
      title="Callbacks — which case actually fired"
      blurb="Each callback receives the ViewTransition instance (its name, or 'auto' if you never set one) and the array of active transition types. They are the fastest way to find out why an element animated the way it did — particularly to confirm whether a move was really a share or was silently an exit plus an enter."
      code={CODE}
      controls={
        <>
          <button
            type="button"
            className="mech-button mech-button--go"
            onClick={() => play({ ...placement, at: mounted ? null : 0 })}
          >
            {mounted ? 'Remove (onExit)' : 'Add (onEnter)'}
          </button>
          <button
            type="button"
            className="mech-button mech-button--go"
            disabled={!mounted}
            onClick={() => play({ ...placement, at: placement.at === 0 ? 1 : 0 })}
          >
            Move (onShare)
          </button>
          <button
            type="button"
            className="mech-button mech-button--go"
            disabled={!mounted}
            onClick={() =>
              play({
                ...placement,
                label: LABELS[(LABELS.indexOf(placement.label) + 1) % LABELS.length],
              })
            }
          >
            Relabel (onUpdate)
          </button>
          <button
            type="button"
            className="mech-button"
            onClick={reset}
            disabled={isInitial && log.length === 0}
          >
            Reset
          </button>
        </>
      }
    >
      <div className="mech-pair">
        <div className="mech-slots mech-slots--two">
          {[0, 1].map((slot) => (
            <div className="mech-slot" key={slot}>
              {placement.at === slot && (
                <ViewTransition
                  name="mech-callbacks"
                  default="mech-glide"
                  enter="mech-pop-in"
                  exit="mech-pop-out"
                  onEnter={record('onEnter')}
                  onExit={record('onExit')}
                  onShare={record('onShare')}
                  onUpdate={record('onUpdate')}
                >
                  <div className="mech-chip">{placement.label}</div>
                </ViewTransition>
              )}
            </div>
          ))}
        </div>

        {log.length === 0 ? (
          <span className="mech-log__empty">No callbacks yet.</span>
        ) : (
          <ul className="mech-log">
            {log.map((entry) => (
              <li className="mech-log__row" key={entry.id}>
                <span className="mech-log__kind">{entry.kind}</span>
                <span className="mech-log__detail">{entry.detail}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Mechanic>
  )
}
