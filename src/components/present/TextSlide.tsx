import type { ReactNode } from 'react'

type TextSlideProps = {
  kicker?: string
  title: ReactNode
  children?: ReactNode
  /** Title slides and section dividers: larger heading, centred. */
  hero?: boolean
}

export function TextSlide({ kicker, title, children, hero = false }: TextSlideProps) {
  return (
    <section className={hero ? 'text-slide text-slide--hero' : 'text-slide'}>
      {kicker && <p className="text-slide__kicker">{kicker}</p>}
      <h1 className="text-slide__title">{title}</h1>
      {children && <div className="text-slide__body">{children}</div>}
    </section>
  )
}

export function Code({ children }: { children: string }) {
  return (
    <pre className="text-slide__code">
      <code>{children}</code>
    </pre>
  )
}
