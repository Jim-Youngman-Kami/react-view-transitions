import { ViewTransition } from 'react'
import { titleName, type Card } from '../lib/cards'
import './CardTitle.css'

type CardTitleProps = {
  card: Card
  /** `h2` in the detail view, `span` inside the tile's button. */
  as?: 'span' | 'h2'
  size?: 'small' | 'large'
}

/**
 * Nested inside the card's own `<ViewTransition>`, which lifts the label out of
 * the card's snapshot so it scales on its own instead of being stretched along
 * with the panel.
 */
export function CardTitle({ card, as: Tag = 'span', size = 'small' }: CardTitleProps) {
  return (
    <ViewTransition name={titleName(card.id)}>
      <Tag className={`card-title card-title--${size}`}>{card.title}</Tag>
    </ViewTransition>
  )
}
