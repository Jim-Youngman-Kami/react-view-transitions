import { ViewTransition } from 'react'
import { useMechanic } from '../../lib/mechanics'
import { Mechanic } from './Mechanic'

const CODE = `<ViewTransition name="outer" default="mech-nest">
  <div className="mech-outer">
    <ViewTransition name="inner" default="mech-nest">
      <div className={grown ? 'mech-inner mech-inner--grown' : 'mech-inner'} />
    </ViewTransition>
  </div>
</ViewTransition>`

/**
 * Nested boundaries are independent groups, and the inner one resizing is what
 * counts as an update for the outer one.
 */
export function Nested() {
  const { value: grown, play, reset, isInitial } = useMechanic(false)

  return (
    <Mechanic
      id="nested"
      tag="nesting"
      title="Nested boundaries are separate groups"
      blurb="Only the inner box changes; the panel around it resizes as a consequence, which is what counts as an update for the outer boundary. The catch is that the two are animated independently, so if only one of them carried a duration override they would visibly come apart mid-flight. Sharing a class is the fix — the same reason the gallery tile and its label share one."
      code={CODE}
      controls={
        <>
          <button type="button" className="mech-button mech-button--go" onClick={() => play((g) => !g)}>
            {grown ? 'Shrink' : 'Grow inner box'}
          </button>
          <button type="button" className="mech-button" onClick={reset} disabled={isInitial}>
            Reset
          </button>
        </>
      }
    >
      <ViewTransition name="mech-nest-outer" default="mech-nest">
        <div className="mech-outer">
          <ViewTransition name="mech-nest-inner" default="mech-nest">
            <div className={grown ? 'mech-inner mech-inner--grown' : 'mech-inner'} />
          </ViewTransition>
        </div>
      </ViewTransition>
    </Mechanic>
  )
}
