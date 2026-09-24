import { addTransitionType, startTransition, useEffect, useState, ViewTransition } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router'
import { SLIDES } from '../components/present/slides'
import { SpeedControl } from '../components/SpeedControl'
import '../mechanics-transitions.css'
import './Present.css'

/**
 * The deck dogfoods the API it presents: the slide direction is only known to
 * the key press, so it is passed to CSS as a transition type.
 */
const SLIDE_MOTION = {
  enter: { 'present-next': 'present-in-right', 'present-prev': 'present-in-left', default: 'none' },
  exit: { 'present-next': 'present-out-left', 'present-prev': 'present-out-right', default: 'none' },
} as const

/**
 * Slides are laid out at this size and zoomed to fit the window. The height is
 * the tallest demo card; the chrome is the header, footer and stage padding.
 */
const DESIGN_WIDTH = 1000
const DESIGN_HEIGHT = 740
const CHROME_HEIGHT = 150
const ZOOM_KEY = 'present-zoom'
const ZOOM_STEP = 0.1

const fitZoom = () => {
  const fit = Math.min(window.innerWidth / DESIGN_WIDTH, (window.innerHeight - CHROME_HEIGHT) / DESIGN_HEIGHT)
  return Math.min(2.4, Math.max(0.5, fit))
}

function useFitZoom() {
  const [fit, setFit] = useState(fitZoom)
  useEffect(() => {
    const onResize = () => setFit(fitZoom())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return fit
}

/** Keys typed into a field belong to the field, not the deck. */
const isEditable = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false
  if (target.isContentEditable || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) {
    return true
  }
  return target instanceof HTMLInputElement && !['checkbox', 'radio', 'button', 'submit'].includes(target.type)
}

export default function Present() {
  const { slide: slideId } = useParams()
  const navigate = useNavigate()
  const fit = useFitZoom()
  const [userZoom, setUserZoom] = useState(() => Number(localStorage.getItem(ZOOM_KEY)) || 1)

  const index = SLIDES.findIndex((slide) => slide.id === slideId)

  useEffect(() => {
    localStorage.setItem(ZOOM_KEY, String(userZoom))
  }, [userZoom])

  useEffect(() => {
    if (index === -1) return

    const go = (target: number) => {
      if (target < 0 || target >= SLIDES.length || target === index) return
      startTransition(() => {
        addTransitionType(target > index ? 'present-next' : 'present-prev')
        navigate(`/present/${SLIDES[target].id}`)
      })
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || isEditable(event.target)) return
      const action: Record<string, () => void> = {
        ArrowRight: () => go(index + 1),
        PageDown: () => go(index + 1),
        ArrowLeft: () => go(index - 1),
        PageUp: () => go(index - 1),
        Home: () => go(0),
        End: () => go(SLIDES.length - 1),
        '+': () => setUserZoom((z) => Math.min(2, z + ZOOM_STEP)),
        '=': () => setUserZoom((z) => Math.min(2, z + ZOOM_STEP)),
        '-': () => setUserZoom((z) => Math.max(0.5, z - ZOOM_STEP)),
        '0': () => setUserZoom(1),
        Escape: () => navigate('/'),
      }
      const run = action[event.key]
      if (!run) return
      event.preventDefault()
      run()
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, navigate])

  if (index === -1) return <Navigate to={`/present/${SLIDES[0].id}`} replace />

  const slide = SLIDES[index]
  const prev = SLIDES[index - 1]
  const next = SLIDES[index + 1]

  const step = (target: typeof slide | undefined, direction: 'next' | 'prev') => {
    if (!target) return
    startTransition(() => {
      addTransitionType(`present-${direction}`)
      navigate(`/present/${target.id}`)
    })
  }

  return (
    <div className="present">
      <div className="present__progress-track">
        <ViewTransition name="present-progress" default="present-progress">
          <div className="present__progress" style={{ width: `${((index + 1) / SLIDES.length) * 100}%` }} />
        </ViewTransition>
      </div>

      <header className="present__header">
        <span className="present__section">{slide.section}</span>
        <span className="present__count">
          {index + 1} / {SLIDES.length}
          <Link to="/" className="present__nav present__nav--exit">
            Exit
          </Link>
        </span>
      </header>

      <div className="present__viewport">
        <div className="present__stage" style={{ zoom: fit * userZoom, width: DESIGN_WIDTH }}>
          {/*
            Keyed by slide so each step is a genuine exit + enter. update="none"
            keeps the slide out of the demos' own transitions: a click inside a
            card is that card's business, not a reason to animate the slide.
          */}
          <ViewTransition key={slide.id} enter={SLIDE_MOTION.enter} exit={SLIDE_MOTION.exit} update="none">
            <div className="present__slide">{slide.render()}</div>
          </ViewTransition>
        </div>
      </div>

      <footer className="present__footer">
        <button type="button" className="present__nav" onClick={() => step(prev, 'prev')} disabled={!prev}>
          ← Prev
        </button>
        <button type="button" className="present__nav" onClick={() => step(next, 'next')} disabled={!next}>
          Next →
        </button>
      </footer>

      <SpeedControl />
    </div>
  )
}
