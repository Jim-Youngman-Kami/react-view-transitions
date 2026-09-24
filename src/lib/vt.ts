/**
 * Thin helpers over the browser's own View Transitions API, for the "How it
 * works" demos that deliberately run without React's `<ViewTransition>`.
 */

export type BrowserViewTransition = ReturnType<Document['startViewTransition']>

export const supportsViewTransitions = () =>
  typeof document !== 'undefined' && typeof document.startViewTransition === 'function'

/**
 * `document.startViewTransition`, with the fallback every real call site needs:
 * without support, just run the update so the page still changes.
 */
export function startBrowserTransition(update: () => void | Promise<void>): BrowserViewTransition | null {
  if (!supportsViewTransitions()) {
    void update()
    return null
  }
  return document.startViewTransition(update)
}

const latestRun = new WeakMap<HTMLElement, number>()
let runCounter = 0

/**
 * Like `startBrowserTransition`, but gives each element its
 * `view-transition-name` only for the duration of this one transition.
 *
 * A permanent name would pull the element into every other transition on the
 * page, even ones it has nothing to do with. Naming on demand is the manual
 * version of what React's `<ViewTransition>` does for you. The run counter stops
 * an interrupted transition from clearing names that a newer one has set.
 */
export function startNamedTransition(
  names: Array<[HTMLElement | null, string]>,
  update: () => void | Promise<void>,
): BrowserViewTransition | null {
  const run = ++runCounter
  const elements = names.filter((entry): entry is [HTMLElement, string] => entry[0] !== null)
  for (const [el, name] of elements) {
    el.style.viewTransitionName = name
    latestRun.set(el, run)
  }

  const clear = () => {
    for (const [el] of elements) {
      if (latestRun.get(el) === run) el.style.viewTransitionName = ''
    }
  }

  const vt = startBrowserTransition(update)
  if (vt) void vt.finished.finally(clear)
  else clear()
  return vt
}

export type PseudoKind = 'group' | 'image-pair' | 'old' | 'new'

export type PseudoAnimation = {
  animation: Animation
  /** The full selector, e.g. `::view-transition-old(root)`. */
  pseudo: string
  kind: PseudoKind
  /** The view-transition-name inside the parentheses. */
  name: string
  /** The keyframes name, e.g. `-ua-view-transition-fade-out`. */
  keyframes: string
}

const PSEUDO = /^::view-transition-(group|image-pair|old|new)\((.+)\)$/

/**
 * Every animation currently attached to a `::view-transition-*` pseudo-element.
 *
 * The pseudo-element tree cannot be queried like the DOM, but its animations
 * are ordinary Web Animations on the document element, each tagged with the
 * pseudo-element it targets — which makes this the one way to see the tree
 * from script while a transition is running.
 */
export function viewTransitionAnimations(): PseudoAnimation[] {
  const found: PseudoAnimation[] = []
  for (const animation of document.getAnimations()) {
    const effect = animation.effect
    if (!(effect instanceof KeyframeEffect) || !effect.pseudoElement) continue
    const match = PSEUDO.exec(effect.pseudoElement)
    if (!match) continue
    found.push({
      animation,
      pseudo: effect.pseudoElement,
      kind: match[1] as PseudoKind,
      name: match[2],
      keyframes: animation instanceof CSSAnimation ? animation.animationName : '(script)',
    })
  }
  return found
}

/**
 * Freezes every view transition animation halfway through for `holdMs`, then
 * lets it carry on. Shows the snapshots mid-flight without needing a debugger.
 */
export function holdAtMidpoint(holdMs: number) {
  const animations = viewTransitionAnimations().map((entry) => entry.animation)
  for (const animation of animations) {
    const end = Number(animation.effect?.getComputedTiming().endTime ?? 0)
    animation.pause()
    animation.currentTime = end / 2
  }
  window.setTimeout(() => {
    for (const animation of animations) animation.play()
  }, holdMs)
}
