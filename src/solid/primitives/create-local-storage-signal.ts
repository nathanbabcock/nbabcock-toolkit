import { Accessor, createSignal, Setter } from 'solid-js'

/**
 * Same API as a regular SolidJS signal,
 * but wraps it in a localStorage key-value store.
 * Uses `JSON.parse` and `JSON.stringify` for serialization.
 * @source https://stackoverflow.com/a/70089129
 */
export default function createLocalStorageSignal<T>(key: string, initial: T): [Accessor<T>, Setter<T>] {
  const localStorageRaw = localStorage.getItem(key)
  const localStorageParsed = localStorageRaw === null ? null : JSON.parse(localStorageRaw) as T
  const initialValue = localStorageParsed === null ? initial : localStorageParsed
  const [value, _setValue] = createSignal<T>(initialValue)

  const setValue = ((arg: any) => {
    const v = _setValue(arg)
    if (v === undefined || v === null) localStorage.removeItem(key)
    else localStorage.setItem(key, JSON.stringify(v))
    return v
  }) as typeof _setValue

  return [value, setValue]
}
