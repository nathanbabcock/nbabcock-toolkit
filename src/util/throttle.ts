// In this file:
// - basic functional wrapper
// - class implementation that handles dynamic function references
// - solid.js hook

import { createEffect } from "solid-js"

/** A higher order function that returns a throttled version of any function */
export function throttleFunctional<F extends (...args: any[]) => any>(
  fn: F,
  intervalMS = 1000,
): (...args: Parameters<F>) => void {
  const global = typeof window !== 'undefined' ? window : globalThis
  let handle: undefined | ReturnType<typeof setTimeout>
  let nextArgs: Parameters<F> | undefined
  let lastTime: number | undefined

  // when invoking, record time and clear state flags
  const invoke = (...invokeArgs: Parameters<F>): void => {
    fn(...invokeArgs)
    lastTime = Date.now()
    nextArgs = undefined
    handle = undefined
  }

  function throttledFn(...args: Parameters<F>) {
    // First call ever
    const isFirstInvoke = lastTime === undefined
    if (isFirstInvoke) {
      invoke(...args)
      return
    }

    const elapsedMS = Date.now() - lastTime!
    const isDuringLockout = elapsedMS < intervalMS
    const isInvocationQueued = handle !== undefined

    // Set the args for an already-scheduled next invocation
    if (isDuringLockout && isInvocationQueued) {
      nextArgs = args
      return
    }

    // Schedule an invocation if needed
    if (isDuringLockout && !isInvocationQueued) {
      nextArgs = args
      handle = global.setTimeout(() => invoke(...nextArgs!), intervalMS - elapsedMS)
      return
    }

    // Called after timer ends but something is still queued
    // This should indicate that `setTimeout` will trigger in the next few milliseconds
    if (!isDuringLockout && isInvocationQueued) {
      nextArgs = args
      return
    }

    // Called after timer w/ nothing queued
    if (!isDuringLockout && !isInvocationQueued) {
      invoke(...args)
      return
    }
  }

  return throttledFn
}

const global = typeof window !== 'undefined' ? window : globalThis

type AnyFn = (...args: any[]) => any

/**
 * A class-based Throttle scheduler that can handle different function
 * references for every invocation, including anonymous closures
 *
 * todo: handle static fn reference with dynamic `nextArgs`?
 * todo: handle dynamically changing intervalMS?
 */
export class Throttle {
  private timeoutHandle: undefined | ReturnType<typeof setTimeout>
  private nextFn: AnyFn | undefined
  private lastInvokeTime: number | undefined
  private intervalMS: number

  constructor(intervalMS = 1000) {
    this.intervalMS = intervalMS
  }

  private doInvoke(fn: AnyFn) {
    this.lastInvokeTime = Date.now()
    this.nextFn = undefined
    fn()
  }

  invoke(fn: AnyFn) {
    // First call ever
    const isFirstInvoke = this.lastInvokeTime === undefined
    if (isFirstInvoke) {
      this.doInvoke(fn)
      return
    }

    const elapsedMS = Date.now() - this.lastInvokeTime!
    const isDuringLockout = elapsedMS < this.intervalMS
    const isInvocationQueued = this.timeoutHandle !== undefined

    // Set the fn for an already-scheduled next invocation
    if (isDuringLockout && isInvocationQueued) {
      this.nextFn = fn
      return
    }

    // Schedule an invocation if needed
    if (isDuringLockout && !isInvocationQueued) {
      this.nextFn = fn
      this.timeoutHandle = global.setTimeout(
        () => this.doInvoke(this.nextFn!),
        this.intervalMS - elapsedMS,
      )
      return
    }

    // Called after timer ends but something is still queued
    // This should indicate that `setTimeout` will trigger in the next few milliseconds
    if (!isDuringLockout && isInvocationQueued) {
      this.nextFn = fn
      return
    }

    // Called after timer w/ nothing queued
    if (!isDuringLockout && !isInvocationQueued) {
      this.doInvoke(fn)
      return
    }
  }

  clear() {
    global.clearTimeout(this.timeoutHandle)
  }

  static wrap<F extends AnyFn>(fn: F): (...args: Parameters<F>) => void {
    const throttle = new Throttle()
    const throttledFn = (...args: Parameters<F>): void => {
      throttle.invoke(() => fn(...args))
    }
    return throttledFn
  }
}

export const throttle = Throttle.wrap

export function createThrottle(
  fn: (throttle: (innerFn: AnyFn) => void) => void,
  intervalMS?: number,
) {
  const throttleObj = new Throttle(intervalMS)
  const throttleFn = (fn: AnyFn) => throttleObj.invoke(fn)
  createEffect(() => fn(throttleFn))
}

