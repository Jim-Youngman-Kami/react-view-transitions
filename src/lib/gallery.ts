export type Habitat = 'land' | 'water'

export type Creature = {
  id: string
  name: string
  /** Card colour only — each creature sits on roughly its own colour. */
  hue: number
  habitat: Habitat
  /** km/h, and the reason the speed sort is worth watching. */
  speed: number
  note: string
}

export const CREATURES: Creature[] = [
  { id: 'fox', name: 'Fox', hue: 8, habitat: 'land', speed: 50, note: 'Chaotic neutral. Will absolutely steal your shoe.' },
  { id: 'tiger', name: 'Tiger', hue: 38, habitat: 'land', speed: 65, note: 'Enormous cat. Same brain, considerably more teeth.' },
  { id: 'seahorse', name: 'Seahorse', hue: 48, habitat: 'water', speed: 0.02, note: 'Technically a fish. Swims like a lost chess piece.' },
  { id: 'flamingo', name: 'Flamingo', hue: 340, habitat: 'water', speed: 60, note: 'Stands on one leg because two would be showing off.' },
  { id: 'treefrog', name: 'Tree Frog', hue: 150, habitat: 'land', speed: 8, note: 'Small, damp, and permanently mid-surprise.' },
  { id: 'kingfisher', name: 'Kingfisher', hue: 190, habitat: 'water', speed: 40, note: 'A tiny blue missile with a fish-related agenda.' },
  { id: 'morpho', name: 'Blue Morpho', hue: 205, habitat: 'land', speed: 12, note: 'Flies like it has never once had a plan.' },
  { id: 'seaslug', name: 'Sea Slug', hue: 265, habitat: 'water', speed: 0.01, note: 'A snail that quit its job and became art.' },
]

export const creatureColor = (creature: Creature) => `hsl(${creature.hue} 68% 52%)`

export const findCreature = (id: string | undefined) => CREATURES.find((c) => c.id === id)

export type Filter = 'all' | Habitat
export type Sort = 'name' | 'speed'

export const FILTERS: Filter[] = ['all', 'land', 'water']
export const SORTS: Sort[] = ['name', 'speed']

export function arrange(filter: Filter, sort: Sort): Creature[] {
  return CREATURES.filter((c) => filter === 'all' || c.habitat === filter).sort((a, b) =>
    sort === 'name' ? a.name.localeCompare(b.name) : a.speed - b.speed,
  )
}

/** Where the next/previous arrows should go, wrapping at both ends. */
export function neighbours(id: string, list: Creature[] = CREATURES) {
  const index = list.findIndex((c) => c.id === id)
  if (index === -1) return { prev: undefined, next: undefined }
  return {
    prev: list[(index - 1 + list.length) % list.length],
    next: list[(index + 1) % list.length],
  }
}

/**
 * Shared names. The grid and the detail route are different components, so
 * these helpers are what let React match the elements across the navigation.
 */
export const creatureName = (id: string) => `creature-${id}`
export const creatureLabelName = (id: string) => `creature-label-${id}`
