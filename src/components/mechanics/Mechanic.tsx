import type { ReactNode } from 'react'
import './Mechanic.css'

type MechanicProps = {
  /** Anchor target, so a card can be linked to directly. */
  id: string
  /** The prop or API being demonstrated, shown as a code tag. */
  tag: string
  title: string
  blurb: string
  code: string
  controls: ReactNode
  children: ReactNode
  /** Taller stage, for demos that print a log or a tree rather than a shape. */
  tall?: boolean
}

export function Mechanic({ id, tag, title, blurb, code, controls, children, tall = false }: MechanicProps) {
  return (
    <section className="mech" id={id}>
      <header className="mech__head">
        <code className="mech__tag">{tag}</code>
        <h2 className="mech__title">{title}</h2>
      </header>

      <p className="mech__blurb">{blurb}</p>

      {/* Fixed height on purpose. A stage that grew or shrank would reflow the
          cards below it, and because the rest of the page is captured as the
          `root` snapshot that reflow would animate as a full-page slide every
          time — drowning out the one mechanic the card is trying to show. */}
      <div className={tall ? 'mech__stage mech__stage--tall' : 'mech__stage'}>{children}</div>

      <div className="mech__controls">{controls}</div>

      <pre className="mech__code">
        <code>{code}</code>
      </pre>
    </section>
  )
}
