import { FILTERS, SORTS, type Filter, type Sort } from '../../lib/gallery'
import './GalleryToolbar.css'

type GalleryToolbarProps = {
  filter: Filter
  sort: Sort
  onChange: (next: { filter?: Filter; sort?: Sort }) => void
}

export function GalleryToolbar({ filter, sort, onChange }: GalleryToolbarProps) {
  return (
    <div className="toolbar">
      <div className="toolbar__group">
        {FILTERS.map((value) => (
          <button
            key={value}
            className={value === filter ? 'chip chip--on' : 'chip'}
            onClick={() => onChange({ filter: value })}
          >
            {value}
          </button>
        ))}
      </div>

      <div className="toolbar__group">
        <span className="toolbar__label">sort</span>
        {SORTS.map((value) => (
          <button
            key={value}
            className={value === sort ? 'chip chip--on' : 'chip'}
            onClick={() => onChange({ sort: value })}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  )
}
