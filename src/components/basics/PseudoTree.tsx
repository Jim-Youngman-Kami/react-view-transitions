import { useRef, useState } from 'react'
import { startNamedTransition, viewTransitionAnimations } from '../../lib/vt'
import { Mechanic } from '../mechanics/Mechanic'
import './Basics.css'
import '../../basics-transitions.css'

type Captured = { name: string; group?: string; old?: string; new?: string }
type Row = { indent: string; pseudo: string; note: string }

const CODE = `::view-transition                        /* overlay on top of the page */
└─ ::view-transition-group(name)         /* animates position + size   */
   └─ ::view-transition-image-pair(name) /* isolation for blending     */
      ├─ ::view-transition-old(name)     /* screenshot, fades out      */
      └─ ::view-transition-new(name)     /* live image, fades in       */`

/**
 * Pseudo-elements cannot be queried like DOM nodes, but their animations are
 * ordinary Web Animations tagged with the pseudo-element they target. Reading
 * `document.getAnimations()` once `ready` resolves is enough to rebuild the
 * tree the browser actually built for this transition.
 */
function capture(): Captured[] {
  const byName = new Map<string, Captured>()
  for (const entry of viewTransitionAnimations()) {
    const node = byName.get(entry.name) ?? { name: entry.name }
    // Each old/new also carries a UA animation that only sets
    // mix-blend-mode: plus-lighter for the cross-fade. It is noise here, but it
    // still proves the pseudo-element exists, so it only fills an empty slot.
    const blend = entry.keyframes.startsWith('-ua-mix-blend-mode')
    const keep = (current: string | undefined) => (blend ? (current ?? 'mix-blend-mode only') : entry.keyframes)
    if (entry.kind === 'group') node.group = keep(node.group)
    if (entry.kind === 'old') node.old = keep(node.old)
    if (entry.kind === 'new') node.new = keep(node.new)
    byName.set(entry.name, node)
  }
  return [...byName.values()].sort((a, b) =>
    a.name === 'root' ? -1 : b.name === 'root' ? 1 : a.name.localeCompare(b.name),
  )
}

function toRows(captured: Captured[]): Row[] {
  const rows: Row[] = [{ indent: '', pseudo: '::view-transition', note: '' }]
  captured.forEach((node, index) => {
    const last = index === captured.length - 1
    const branch = last ? '└─ ' : '├─ '
    const stem = last ? '   ' : '│  '
    rows.push({ indent: branch, pseudo: `::view-transition-group(${node.name})`, note: node.group ?? 'no animation' })
    rows.push({ indent: `${stem}└─ `, pseudo: `::view-transition-image-pair(${node.name})`, note: '' })
    const images = [
      node.old && { pseudo: `::view-transition-old(${node.name})`, note: node.old },
      node.new && { pseudo: `::view-transition-new(${node.name})`, note: node.new },
    ].filter((image): image is { pseudo: string; note: string } => Boolean(image))
    images.forEach((image, i) => {
      rows.push({ indent: `${stem}   ${i === images.length - 1 ? '└─ ' : '├─ '}`, ...image })
    })
  })
  return rows
}

export function PseudoTree() {
  const tile = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(true)
  const [rows, setRows] = useState<Row[]>([])

  const run = (mutate: (el: HTMLDivElement) => void) => {
    const vt = startNamedTransition([[tile.current, 'box']], () => {
      if (tile.current) mutate(tile.current)
    })
    vt?.ready.then(() => setRows(toRows(capture()))).catch(() => setRows([]))
  }

  const move = () =>
    run((el) => {
      el.dataset.side = el.dataset.side === 'right' ? 'left' : 'right'
    })

  const toggle = () => {
    const next = !shown
    setShown(next)
    run((el) => {
      el.hidden = !next
    })
  }

  return (
    <Mechanic
      id="pseudo-tree"
      tag="::view-transition-*"
      title="What the browser builds"
      blurb="For every name in the transition the browser builds a small tree of pseudo-elements in an overlay above the page. The group moves and resizes; old is a flat screenshot, new is a live image of the updated element. The tree on the right is read from the running animations, not hard-coded. Remove or add the box and one side of the pair disappears: that is all an exit or an enter is."
      code={CODE}
      tall
      controls={
        <>
          <button type="button" className="mech-button mech-button--go" onClick={move} disabled={!shown}>
            Move (old + new)
          </button>
          <button type="button" className="mech-button mech-button--go" onClick={toggle}>
            {shown ? 'Remove (old only)' : 'Add (new only)'}
          </button>
        </>
      }
    >
      <div className="basics-split">
        <div className="basics-track basics-track--narrow">
          <div
            ref={tile}
            className="basics-tile basics-tile--named"
            data-side="left"
          />
        </div>

        {rows.length === 0 ? (
          <span className="mech-log__empty">Run a transition to see its pseudo-element tree.</span>
        ) : (
          <div className="basics-tree" role="tree">
            {rows.map((row, index) => (
              <div className="basics-tree__row" key={index} role="treeitem">
                <span className="basics-tree__indent">{row.indent}</span>
                <span className="basics-tree__pseudo">{row.pseudo}</span>
                <span className="basics-tree__note">{row.note}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Mechanic>
  )
}
