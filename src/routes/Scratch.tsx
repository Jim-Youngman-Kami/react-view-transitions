import { startTransition, useState, ViewTransition } from 'react'
import './Scratch.css'

/**
 * A deliberately bare sandbox for live-coding during a talk. Not linked from
 * the tab bar; open /scratch directly and edit this file with the dev server
 * running.
 */
export default function Scratch() {
  const [open, setOpen] = useState(false)

  return (
    <main className="page scratch">
      <button type="button" className="scratch__button" onClick={() => startTransition(() => setOpen((o) => !o))}>
        Toggle
      </button>

      <ViewTransition name="scratch-box">
        <div className={open ? 'scratch__box scratch__box--open' : 'scratch__box'} />
      </ViewTransition>
    </main>
  )
}
