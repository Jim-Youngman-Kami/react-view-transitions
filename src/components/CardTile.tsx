import { ViewTransition } from 'react'
import { cardName, type Card } from '../lib/cards'
import { CardTitle } from './CardTitle'
import './CardTile.css'

type CardTileProps = {
  card: Card
  onOpen: (id: string) => void
}

export function CardTile({ card, onOpen }: CardTileProps) {
  return (
    <ViewTransition name={cardName(card.id)}>
      <button
        className="card-tile"
        style={{ background: card.color }}
        onClick={() => onOpen(card.id)}
      >
        <CardTitle card={card} />
      </button>
    </ViewTransition>
  )
}
