import { useEffect, useState } from 'react'
import './SpeedControl.css'

/**
 * Discrete stops rather than a continuous range, so the readout is always a
 * round number and the useful slow end gets as much of the track as the fast
 * end. The slider index maps to a speed multiplier; the CSS variable wants the
 * reciprocal, because it scales durations rather than speed.
 */
const SPEEDS = [0.1, 0.25, 0.5, 1, 2, 4]
const NORMAL = SPEEDS.indexOf(1)

const format = (speed: number) => `${speed}\u00d7`

export function SpeedControl() {
  const [index, setIndex] = useState(NORMAL)
  const speed = SPEEDS[index]

  useEffect(() => {
    // Every duration in view-transitions.css is a multiple of --vt-scale, and
    // the pseudo-element tree inherits from the document element, so this one
    // property retimes all of them.
    document.documentElement.style.setProperty('--vt-scale', String(1 / speed))
  }, [speed])

  return (
    <div className="speed">
      <label className="speed__label" htmlFor="speed-input">
        Speed
      </label>
      <input
        id="speed-input"
        className="speed__input"
        type="range"
        min={0}
        max={SPEEDS.length - 1}
        step={1}
        value={index}
        aria-valuetext={format(speed)}
        onChange={(event) => setIndex(Number(event.target.value))}
        // A focused range input keeps the arrow keys, which would stop them
        // changing slides in the deck. Mouse users get focus handed back;
        // keyboard users who tabbed here keep it.
        onPointerUp={(event) => event.currentTarget.blur()}
      />
      <output className="speed__value" htmlFor="speed-input">
        {format(speed)}
      </output>
      <button
        type="button"
        className="speed__reset"
        onClick={() => setIndex(NORMAL)}
        disabled={index === NORMAL}
      >
        Reset
      </button>
    </div>
  )
}
