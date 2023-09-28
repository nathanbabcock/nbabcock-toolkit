/**
 * Returns a debounced version of any function.
 *
 * When the debounced function is called, it will delay for `waitMS` milliseconds before
 * calling the inner function. If it's called again before the time limit, the
 * timer is reset.
 *
 * ## Example use case
 *
 * When dragging a UI element with the mouse, state updates with every pixel of
 * movement. That's too often to write to a database, so the DB update is
 * debounced inside of a `useEffect`. The UI updates instantly, but the DB
 * update occurs only once, 500ms after the last movement. This guarantees that
 * DB writes will occur at most every 500ms (plenty of time for one transaction
 * to complete).
 */
export function debounce<T extends Function>(fn: T, waitMS = 500) {
  let h = 0
  let debouncedFn = (...args: any) => {
    window.clearTimeout(h)
    h = window.setTimeout(() => fn(...args), waitMS)
  }
  return <T>(<any>debouncedFn)
}
