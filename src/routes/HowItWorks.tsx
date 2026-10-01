import { RawStart } from '../components/basics/RawStart'
import { Lifecycle } from '../components/basics/Lifecycle'
import { NameMatching } from '../components/basics/NameMatching'
import { PseudoTree } from '../components/basics/PseudoTree'
import { StylingPseudos } from '../components/basics/StylingPseudos'
import { WhatReactAdds } from '../components/basics/WhatReactAdds'
import '../mechanics-transitions.css'
import './Mechanics.css'

/**
 * The browser API underneath `<ViewTransition>`, one piece per card. All but
 * the last card call `document.startViewTransition` directly, so each piece can
 * be seen before React is layered on top of it.
 */
export default function HowItWorks() {
  return (
    <main className="page mech-page">
      <p className="mech-page__intro">
        These cards use the browser&apos;s View Transitions API directly, without React&apos;s
        &lt;ViewTransition&gt;. The last one shows what React layers on top. The Mechanics tab then
        takes the React API apart one prop at a time. One app-wide rule still applies here:{' '}
        <code>view-transitions.css</code> slows every group to 600ms and stretches snapshots to the
        group&apos;s height, so &ldquo;default&rdquo; below means default animations, not default timing.
      </p>

      <div className="mech-list">
        <RawStart />
        <Lifecycle />
        <NameMatching />
        <PseudoTree />
        <StylingPseudos />
        <WhatReactAdds />
      </div>
    </main>
  )
}
