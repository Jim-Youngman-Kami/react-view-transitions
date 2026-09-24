import { ViewTransition } from 'react'
import { cardName, type Card } from '../lib/cards'
import { CardTitle } from './CardTitle'
import './CardDetail.css'

type CardDetailProps = {
  card: Card
  onBack: () => void
}

export function CardDetail({ card, onBack }: CardDetailProps) {
  return (
    <>
      <ViewTransition name={cardName(card.id)}>
        <article className="card-detail" style={{ background: card.color }}>
          <CardTitle card={card} as="h2" size="large" />
        </article>
      </ViewTransition>
      <button className="back-button" onClick={onBack}>
        ← Back
      </button>
    </>
  )
}
