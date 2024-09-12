type AsyncFn<T = any> = () => Promise<T>

/**
 * - Only one function in the queue is allowed to run at a time.
 * - One additional function may be queued to run after the current one.
 * - Additional calls to `queue` will *replace* the queued function ("drop frames")
 */
export function asyncDropQueue() {
  let current: Promise<any> | undefined
  let queued: AsyncFn | undefined

  const onFinishCurrent = () => {
    current = undefined
    if (queued) {
      current = queued().finally(onFinishCurrent)
      queued = undefined
    }
  }

  const queue = (fn: AsyncFn): void => {
    if (!current) current = fn().finally(onFinishCurrent)
    else queued = fn
  }

  return { queue }
}

// todo: think of a better name?
// todo: handle non-async also?
