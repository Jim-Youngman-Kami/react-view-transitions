export type Card = {
  id: string
  title: string
  color: string
}

export const CARDS: Card[] = [
  { id: 'aurora', title: 'Aurora', color: '#7c3aed' },
  { id: 'ember', title: 'Ember', color: '#e11d48' },
  { id: 'tide', title: 'Tide', color: '#0891b2' },
]

export const findCard = (id: string | null) => CARDS.find((card) => card.id === id)

/**
 * A view transition only animates when the same `name` appears on both sides of
 * the update. Now that the two sides live in different components, these helpers
 * are what keep them in sync.
 */
export const cardName = (id: string) => `card-${id}`
export const titleName = (id: string) => `title-${id}`
