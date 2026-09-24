import { ViewTransition } from 'react'
import { useMechanic } from '../../lib/mechanics'
import { Mechanic } from './Mechanic'

const VALUES = ['42 items', '1,208 items', '7 items', '96 items']

const CODE = `<ViewTransition update="mech-roll">
  <div className="mech-readout">{VALUES[index]}</div>
</ViewTransition>`

/**
 * `update` is the case where the element never unmounts — the same box is still
 * there, its contents just changed, so there really are two snapshots to play
 * against each other.
 */
export function UpdateDemo() {
  const { value: index, play, reset, isInitial } = useMechanic(0)

  return (
    <Mechanic
      id="update"
      tag="update"
      title="update — same element, new contents"
      blurb="Applies when the element stays mounted but its content changed, or an inner ViewTransition resized. The default behaviour is a cross-fade; rolling the old snapshot out while the new one rolls in reads as a value being replaced instead. Note the box also resizes, and the group animates that on its own."
      code={CODE}
      controls={
        <>
          <button
            type="button"
            className="mech-button mech-button--go"
            onClick={() => play((i) => (i + 1) % VALUES.length)}
          >
            Next value
          </button>
          <button type="button" className="mech-button" onClick={reset} disabled={isInitial}>
            Reset
          </button>
        </>
      }
    >
      <ViewTransition name="mech-update" default="mech-smooth" update="mech-roll">
        <div className="mech-readout">{VALUES[index]}</div>
      </ViewTransition>
    </Mechanic>
  )
}
