import { useState, startTransition } from 'react'
import { CARDS, findCard } from '../lib/cards'
import { Heading } from '../components/Heading'
import { CardGrid } from '../components/CardGrid'
import { CardDetail } from '../components/CardDetail'

export default function SimpleDemo() {
  const [openId, setOpenId] = useState<string | null>(null)

  // View transitions only run for updates inside a transition.
  const navigate = (id: string | null) => startTransition(() => setOpenId(id))

  const open = findCard(openId)

  return (
    <main className="page">
      <Heading compact={open !== undefined} />

      {open ? (
        <CardDetail card={open} onBack={() => navigate(null)} />
      ) : (
        <CardGrid cards={CARDS} onOpen={navigate} />
      )}
    </main>
  )
}
