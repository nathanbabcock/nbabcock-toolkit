import { createStore } from 'solid-js/store'

/**
 * Identical API to Solid Store, but wrapped with read/write to/from localStorage
 *
 * @see https://github.com/solidjs-community/solid-primitives/issues/205
 *
 * @param key unique string identifier to use for localStorage
 * @param storeArg same as Solid Store
 * @param options same as Solid Store
 * @returns void
 */
export default function createLocalStore<T extends object>(
  key: string,
  ...[storeArg, options]: Parameters<typeof createStore<T>>
): ReturnType<typeof createStore<T>> {
  // Fetch a previous value from localStorage, if it exists
  const localStorageRaw: string | null = localStorage.getItem(key)
  const localStorageParsed: T | null = localStorageRaw === null ? null : JSON.parse(localStorageRaw) as T
  const initialValue: T = localStorageParsed === null ? storeArg! : localStorageParsed

  // Initialize the store with EITHER a saved value from localStorage,
  // or (as a fallback) the initial value passed in from storeArg
  // (localStorage always takes precedence if present)
  const [store, setStore] = createStore(initialValue, options)

  // Wrap the setter in a function that also writes to localStorage
  const setLocalStore: typeof setStore = (...args: any[]) => {
    const retVal = setStore(...(args as [any])) // ew https://stackoverflow.com/a/72450001
    localStorage.setItem(key, JSON.stringify(store))
    return retVal // void, but left in case of future changes
  }

  // Same return type as `createStore`
  return [store, setLocalStore]
}
