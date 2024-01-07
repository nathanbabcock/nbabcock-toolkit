import { type RefObject, useEffect } from 'react'

/** e.g. `useEventListener(document, "click", () => {})` */
export function useEventListener<
  TTarget extends EventTarget = EventTarget,
  TType extends string = string
>(
  targetOrRef: TTarget | RefObject<TTarget>,
  type: TType,
  listener: Listener<TTarget, TType>,
  options?: boolean | AddEventListenerOptions
) {
  return useEffect(() => {
    const target = 'current' in targetOrRef ? targetOrRef.current : targetOrRef
    target?.addEventListener(type, listener, options)
    return () => target?.removeEventListener(type, listener, options)
  }, [targetOrRef, type, listener, options])
}

// Provide event typesafety via reverse mapped types:
// - https://github.com/alexreardon/bind-event-listener/blob/master/src/types.ts
// - https://portal.gitnation.org/contents/infer-multiple-things-at-once-with-reverse-mapped-types
type InferEvent<
  TTarget,
  TType extends string
> = `on${TType}` extends keyof TTarget
  ? Parameters<Extract<TTarget[`on${TType}`], UnknownFunction>>[0]
  : Event

// For listener objects, the handleEvent function has the object as the `this` binding
type ListenerObject<TEvent extends Event> = {
  handleEvent(this: ListenerObject<TEvent>, event: TEvent): void
}

// event listeners can be an object or a function
type Listener<TTarget extends EventTarget, TType extends string> =
  | ListenerObject<InferEvent<TTarget, TType>>
  | { (this: TTarget, ev: InferEvent<TTarget, TType>): void }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UnknownFunction = (...args: any[]) => any
