import { type RefObject, useEffect } from 'react'

// "Reverse mapped type" approach from this video: https://portal.gitnation.org/contents/infer-multiple-things-at-once-with-reverse-mapped-types
type PossibleEventType<K> = K extends `on${infer Type}` ? Type : never
type GetEvent<Name> = Name extends keyof HTMLElementEventMap
  ? HTMLElementEventMap[Name]
  : Event

export function useEventListener<
  T extends EventTarget,
  E extends PossibleEventType<keyof T>
>(
  targetOrRef: T | RefObject<T>,
  eventName: E,
  handler: (event: GetEvent<E>) => void
) {
  return useEffect(() => {
    const element = 'current' in targetOrRef ? targetOrRef.current : targetOrRef
    element?.addEventListener(eventName, handler as EventListener)
    return () =>
      element?.removeEventListener(eventName, handler as EventListener)
  }, [targetOrRef, eventName, handler])
}
