import { TriggerGate } from '../components/mechanics/TriggerGate'
import { DefaultClass } from '../components/mechanics/DefaultClass'
import { EnterExit } from '../components/mechanics/EnterExit'
import { UpdateDemo } from '../components/mechanics/UpdateDemo'
import { ShareDemo } from '../components/mechanics/ShareDemo'
import { AutoName } from '../components/mechanics/AutoName'
import { NoneOptOut } from '../components/mechanics/NoneOptOut'
import { TransitionTypes } from '../components/mechanics/TransitionTypes'
import { Callbacks } from '../components/mechanics/Callbacks'
import { Nested } from '../components/mechanics/Nested'
import { DeferredTrigger } from '../components/mechanics/DeferredTrigger'
import '../mechanics-transitions.css'
import './Mechanics.css'

/**
 * One mechanic per card, each isolated so it can be triggered and reset on its
 * own. The two original demos show these combined into something that looks
 * like a real interface; this page takes them apart again.
 */
export default function Mechanics() {
  return (
    <main className="page mech-page">
      <p className="mech-page__intro">
        Every card below runs one mechanic on its own. Trigger it, then reset — the reset is a plain
        setState, so it snaps back without animating and you can watch the same effect again from a
        clean start. The speed slider at the bottom slows all of them down together.
      </p>

      <div className="mech-list">
        <TriggerGate />
        <DeferredTrigger />
        <DefaultClass />
        <EnterExit />
        <UpdateDemo />
        <ShareDemo />
        <AutoName />
        <NoneOptOut />
        <TransitionTypes />
        <Nested />
        <Callbacks />
      </div>
    </main>
  )
}
