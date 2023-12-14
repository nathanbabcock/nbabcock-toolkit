import { RefObject, useEffect } from 'react'

export function useEventListener<T extends EventTarget, E extends Event>(
  elementOrRef: T | RefObject<T>,
  eventName: string,
  handler: (event: E) => void
) {
  useEffect(() => {
    const element =
      'current' in elementOrRef ? elementOrRef.current : elementOrRef
    element?.addEventListener(eventName, handler as EventListener)
    return () =>
      element?.removeEventListener(eventName, handler as EventListener)
  }, [elementOrRef, eventName, handler])
}
