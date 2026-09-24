import { ViewTransition } from 'react'
import { Link } from 'react-router'
import { creatureColor, creatureLabelName, creatureName, type Creature } from '../../lib/gallery'
import './GalleryTile.css'

type GalleryTileProps = {
  creature: Creature
}

export function GalleryTile({ creature }: GalleryTileProps) {
  return (
    <ViewTransition
      name={creatureName(creature.id)}
      // `default` is the base class, applied whenever this element animates.
      default="gallery-move"
      // `enter` / `exit` are combined with it, but only when the tile is added
      // or removed — so filtering animates leavers and joiners differently.
      enter="tile-enter"
      exit="tile-exit"
    >
      <Link
        to={`/gallery/${creature.id}`}
        className="gallery-tile"
        style={{ background: creatureColor(creature) }}
      >
        {/* The label is its own group, so it needs the same duration as the
            tile — otherwise the two drift apart while the grid reshuffles. */}
        <ViewTransition name={creatureLabelName(creature.id)} default="gallery-move">
          <span className="gallery-tile__name">{creature.name}</span>
        </ViewTransition>
      </Link>
    </ViewTransition>
  )
}
