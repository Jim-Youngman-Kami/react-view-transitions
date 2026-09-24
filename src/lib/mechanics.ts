import { startTransition, useState } from 'react'

/**
 * Every card on the mechanics page is driven the same way: a trigger that runs
 * inside a transition, and a reset that deliberately does not.
 *
 * Resetting without a transition matters more than it sounds. If the reset were
 * animated too you would watch the effect play backwards before you could run
 * it again, which makes a single mechanic hard to isolate. A plain `setState`
 * snaps straight back to the starting state — and doubles as a reminder that an
 * update outside a transition never animates.
 */
export function useMechanic<T>(initial: T) {
  const [value, setValue] = useState<T>(initial)

  return {
    value,
    /** Animated. View transitions only run for updates inside a transition. */
    play: (next: T | ((prev: T) => T)) => startTransition(() => setValue(next)),
    /** Not animated, on purpose. */
    reset: () => setValue(initial),
    isInitial: Object.is(value, initial),
  }
}
