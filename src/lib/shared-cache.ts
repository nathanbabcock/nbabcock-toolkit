import { createLogger } from './logger'
import { useState, useEffect } from 'react'

export type SharedCacheOptions<T, TCreateArgs extends any[] = []> = {
  /** Factory function for creating an item in the cache when one doesn't already exist */
  createItem: (...args: TCreateArgs) => T

  /**
   * Given the arguments passed to {@linkcode SharedCacheOptions.createItem},
   * returns a string that will be used as the cache key. In many cases this may
   * just return the first argument unchanged, or it can be a more complex computation.
   *
   * todo: revisit once results store is refactored to use a string key instead of meta object
   */
  getCacheKey: (...args: TCreateArgs) => string

  /** Optional identifier for logging */
  label?: string

  /**
   * Callback for running any needed cleanup logic after the last reference to
   * an item is released and it has been removed from the cache
   */
  onDestroyItem?: (item: T, key: string) => void
}

/**
 * Defines keys, types, and lifecycle methods for items to be stored in a shared cache.
 * The caller is responsible for releasing cached items when they are no longer needed.
 */
export function createSharedCache<T, TCreateArgs extends any[] = []>(
  options: SharedCacheOptions<T, TCreateArgs>
) {
  const cache = new Map<string, { referenceCount: number; value: T }>()

  const logger = createLogger(options.label ? `[shared-cache/${options.label}]` : '[shared-cache]')

  const acquire = (...args: TCreateArgs): T => {
    const key = options.getCacheKey(...args)
    const existingItem = cache.get(key)
    if (existingItem) {
      existingItem.referenceCount++
      const msg = `acquired existing item: ${key} (${existingItem.referenceCount} refs)`
      logger.info(msg)
      return existingItem.value
    } else {
      const value = options.createItem(...args)
      cache.set(key, { referenceCount: 1, value })
      logger.info(`created item: ${key}`)
      return value
    }
  }

  const release = (key: string): void => {
    const existingItem = cache.get(key)
    if (existingItem) {
      existingItem.referenceCount--
      const msg = `released item: ${key} (${existingItem.referenceCount} refs remaining)`
      logger.info(msg)
      if (existingItem.referenceCount === 0) destroy(key, existingItem.value)
    } else {
      logger.warn(`Attempted to release non-existent cache item: ${key}`)
    }
  }

  /** @private */
  const destroy = (key: string, existingItem: T) => {
    cache.delete(key)
    options.onDestroyItem?.(existingItem, key)
    logger.info(`destroyed item: ${key}`)
  }

  /** ⚠️ Careful: args should contain stable references */
  const useCacheItem = (...args: TCreateArgs): T | undefined => {
    const [collection, setCollection] = useState<T | undefined>()

    // Must be a `useEffect` to satisfy `StrictMode`,
    // otherwise mismatches between effects and renders will release early.
    useEffect(() => {
      // oxlint-disable-next-line exhaustive-deps: caller passes deps array
      if (!args) return setCollection(undefined)

      setCollection(acquire(...args))

      const key = options.getCacheKey(...args)
      return () => release(key)
    }, [...args]) // oxlint-disable-line exhaustive-deps: caller passes deps array

    return collection
  }

  /**
   * _(experimental)_ Acquire a cache item with a `using` declaration.
   *
   * ```ts
   * using cacheItem = cache.acquireDisposable(key)
   * ```
   *
   * This would not be suitable for usage inside React components or long-running tasks
   * with non-awaited callbacks, because the item will automatically be released
   * at the end of the current scope, potentially running the `onDestroy` callback.
   *
   * @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#using-declarations-and-explicit-resource-management
   */
  const acquireDisposable = (...args: TCreateArgs): T & { [Symbol.dispose]: () => void } => {
    const item = acquire(...args)
    const key = options.getCacheKey(...args)
    return {
      ...item,
      [Symbol.dispose]: () => {
        logger.info(`disposing item: ${key}`)
        release(key)
      },
    }
  }

  /**
   * _(experimental)_ Yet another way of acquiring a cache item, this time with
   * the `acquire`/`release` semantics governed by an explicit callback scope.
   * `release` will be called automatically after the callback executes (not awaited).
   *
   * @see https://effect.website/docs/resource-management/scope/#acquirerelease
   */
  const using = (usingOptions: { args: TCreateArgs; callback: (item: T) => void }): void => {
    const item = acquire(...usingOptions.args)
    const key = options.getCacheKey(...usingOptions.args)
    try {
      usingOptions.callback(item)
    } finally {
      release(key)
    }
  }

  return {
    // core:
    acquire,
    release,

    // react:
    useCacheItem,

    // experimental:
    acquireDisposable,
    using,
  }
}
