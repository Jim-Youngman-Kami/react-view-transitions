import { ViewTransition, addTransitionType, startTransition } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import {
  findCreature,
  neighbours,
  creatureColor,
  creatureLabelName,
  creatureName,
  type Creature,
} from '../lib/gallery'
import './GalleryItem.css'

/**
 * The slide direction cannot be derived from the DOM — only the click knows
 * whether we are going forwards or backwards. `addTransitionType` tags the
 * update so the CSS below can pick the matching animation.
 */
const DIRECTIONAL = {
  enter: { 'nav-next': 'enter-right', 'nav-prev': 'enter-left', default: 'none' },
  exit: { 'nav-next': 'exit-left', 'nav-prev': 'exit-right', default: 'none' },
} as const

export default function GalleryItem() {
  const { id } = useParams()
  const navigate = useNavigate()
  const creature = findCreature(id)

  if (!creature) {
    return (
      <main className="page">
        <p className="detail__missing">No such creature.</p>
        <Link to="/gallery" className="ghost-button">
          ← Back to gallery
        </Link>
      </main>
    )
  }

  const { prev, next } = neighbours(creature.id)

  const go = (target: Creature, direction: 'next' | 'prev') => {
    startTransition(() => {
      addTransitionType(`nav-${direction}`)
      navigate(`/gallery/${target.id}`)
    })
  }

  return (
    <main className="page">
      {/*
        Keyed by id so stepping between creatures is a genuine exit + enter (the
        names differ), which is what lets the directional classes apply. Arriving
        from the grid is different: the name matches the tile that was clicked,
        so React shares the element and morphs it instead.
      */}
      <ViewTransition
        key={creature.id}
        name={creatureName(creature.id)}
        default="gallery-move"
        enter={DIRECTIONAL.enter}
        exit={DIRECTIONAL.exit}
      >
        <article className="detail-panel" style={{ background: creatureColor(creature) }}>
          <ViewTransition name={creatureLabelName(creature.id)} default="gallery-move">
            <h2 className="detail-panel__name">{creature.name}</h2>
          </ViewTransition>
          <p className="detail-panel__meta">
            {creature.speed} km/h · {creature.habitat}
          </p>
        </article>
      </ViewTransition>

      {/* Not present in the grid at all, so it only ever enters and exits. */}
      <ViewTransition key={`note-${creature.id}`} enter="rise" exit="sink">
        <p className="detail__note">{creature.note}</p>
      </ViewTransition>

      <div className="detail__controls">
        <button className="ghost-button" onClick={() => prev && go(prev, 'prev')}>
          ← {prev?.name}
        </button>
        <Link to="/gallery" className="ghost-button">
          Gallery
        </Link>
        <button className="ghost-button" onClick={() => next && go(next, 'next')}>
          {next?.name} →
        </button>
      </div>
    </main>
  )
}
