/** Await multiple event callbacks via repeated `next()` calls. */
export async function* generateEventListener(
  target: EventTarget,
  type: string
): AsyncGenerator<Event, void, void> {
  const scope: { resolve?: (e: Event) => void } = {}
  const listener = (e: Event) => scope.resolve?.(e)
  target.addEventListener(type, listener)
  try {
    while (true) yield await new Promise<Event>(r => (scope.resolve = r))
  } finally {
    target.removeEventListener(type, listener)
  }
}
