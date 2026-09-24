import { startTransition } from 'react'
import { useSearchParams } from 'react-router'
import { arrange, type Filter, type Sort } from '../lib/gallery'
import { GalleryToolbar } from '../components/gallery/GalleryToolbar'
import { GalleryTile } from '../components/gallery/GalleryTile'
import './Gallery.css'

export default function Gallery() {
  const [params, setParams] = useSearchParams()

  const filter = (params.get('filter') ?? 'all') as Filter
  const sort = (params.get('sort') ?? 'name') as Sort

  const update = (next: { filter?: Filter; sort?: Sort }) => {
    // setSearchParams is a navigation, so React Router already wraps it in a
    // transition — but being explicit keeps it obvious why this animates.
    startTransition(() => {
      setParams(
        { filter: next.filter ?? filter, sort: next.sort ?? sort },
        { replace: true, preventScrollReset: true },
      )
    })
  }

  const creatures = arrange(filter, sort)

  return (
    <main className="page">
      <p className="gallery__hint">
        Filter and sort to move tiles. Open one to morph it into a detail view.
      </p>

      <GalleryToolbar filter={filter} sort={sort} onChange={update} />

      <div className="gallery-grid">
        {creatures.map((creature) => (
          <GalleryTile key={creature.id} creature={creature} />
        ))}
      </div>
    </main>
  )
}
