import type { Card } from '../lib/cards'
import { CardTile } from './CardTile'
import './CardGrid.css'

type CardGridProps = {
  cards: Card[]
  onOpen: (id: string) => void
}

export function CardGrid({ cards, onOpen }: CardGridProps) {
  return (
    <div className="card-grid">
      {cards.map((card) => (
        <CardTile key={card.id} card={card} onOpen={onOpen} />
      ))}
    </div>
  )
}
