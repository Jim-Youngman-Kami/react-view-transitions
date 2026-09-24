import { useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { startNamedTransition } from '../../lib/vt'
import { Mechanic } from '../mechanics/Mechanic'
import './Basics.css'
import '../../basics-transitions.css'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

const STYLES = [
  { value: '', label: 'UA default (cross-fade)' },
  { value: 'basics-slide', label: '.basics-slide' },
  { value: 'basics-flip', label: '.basics-flip' },
]

const CODE = `/* One element, by name… */
::view-transition-old(day) { animation: slide-out 240ms both; }

/* …or any element with view-transition-class: basics-slide */
::view-transition-old(*.basics-slide) { animation: slide-out 240ms both; }
::view-transition-new(*.basics-slide) { animation: slide-in 460ms both; }

// Before <ViewTransition>: React has to finish rendering inside the callback.
document.startViewTransition(() => flushSync(() => setDay(next)))`

/**
 * The animations are plain CSS on the pseudo-elements. React's `default`,
 * `enter`, `exit`, `update` and `share` props do nothing more than choose the
 * `view-transition-class` these selectors match.
 */
export function StylingPseudos() {
  const [day, setDay] = useState(0)
  const [style, setStyle] = useState('basics-slide')
  const panel = useRef<HTMLDivElement>(null)

  // flushSync is what makes the DOM update synchronously inside the callback;
  // without it React would render later and the "new" screenshot would be
  // identical to the old one.
  const next = () =>
    startNamedTransition([[panel.current, 'day']], () => flushSync(() => setDay((d) => (d + 1) % DAYS.length)))

  return (
    <Mechanic
      id="styling"
      tag="view-transition-class"
      title="It is just CSS"
      blurb="The default animations are a cross-fade on old/new and a position-and-size animation on the group. Everything else is ordinary CSS animations on those pseudo-elements, targeted by name or, more usefully, by view-transition-class so that one rule covers many elements. This demo still uses the raw browser API — note the flushSync that is needed to make React render inside the callback."
      code={CODE}
      controls={
        <>
          <button type="button" className="mech-button mech-button--go" onClick={next}>
            Next day
          </button>
          {STYLES.map((option) => (
            <button
              key={option.value}
              type="button"
              className={style === option.value ? 'mech-button basics-choice basics-choice--on' : 'mech-button basics-choice'}
              aria-pressed={style === option.value}
              onClick={() => setStyle(option.value)}
            >
              {option.label}
            </button>
          ))}
        </>
      }
    >
      <div ref={panel} className="mech-readout basics-day" style={{ viewTransitionClass: style || 'none' }}>
        {DAYS[day]}
      </div>
    </Mechanic>
  )
}
