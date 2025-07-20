/** pure trailing-edge; always invokes w/ latest args, dropping older pending invocations */
export function throttle<F extends (...args: any[]) => void>(
  fn: F,
  delayMs: number
): (...args: Parameters<F>) => void {
  let timeout: ReturnType<typeof setTimeout> | undefined
  let lastInvokeTime: number | undefined
  let latestArgs: Parameters<F> | undefined

  const throttledFn = (...args: Parameters<F>) => {
    // an invoke is already scheduled; just update the args
    if (timeout) {
      latestArgs = args
      return
    }

    // this is the first time calling; schedule fn on the trailing edge
    if (lastInvokeTime === undefined) {
      latestArgs = args
      timeout = setTimeout(() => {
        fn(...latestArgs!)
        lastInvokeTime = Date.now()
        timeout = undefined
        latestArgs = undefined
      }, delayMs)
      return
    }

    // not enough time has passed since the last invoke
    const timeSinceLastInvoke = Date.now() - lastInvokeTime
    if (timeSinceLastInvoke < delayMs) {
      latestArgs = args
      timeout = setTimeout(() => {
        fn(...latestArgs!)
        lastInvokeTime = Date.now()
        timeout = undefined
        latestArgs = undefined
      }, delayMs - timeSinceLastInvoke)
      return
    }

    // enough time has passed to restart the interval again on the trailing edge
    latestArgs = args
    timeout = setTimeout(() => {
      fn(...latestArgs!)
      lastInvokeTime = Date.now()
      timeout = undefined
      latestArgs = undefined
    }, delayMs)
  }

  return throttledFn as (...args: Parameters<F>) => void
}
