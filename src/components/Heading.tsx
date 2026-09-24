import { ViewTransition } from 'react'
import './Heading.css'

type HeadingProps = {
  /** Shrinks the heading and pulls it to the left. */
  compact?: boolean
}

export function Heading({ compact = false }: HeadingProps) {
  return (
    <div className={compact ? 'heading-row heading-row--start' : 'heading-row'}>
      <ViewTransition name="heading">
        <h1 className={compact ? 'heading heading--small' : 'heading'}>
          React &lt;ViewTransition&gt;
        </h1>
      </ViewTransition>
    </div>
  )
}
