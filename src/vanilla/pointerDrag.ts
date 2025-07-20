import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'

export interface PointerDragEvent {
  nativeEvent: PointerEvent
  startX: number
  startY: number
  offsetX: number
  offsetY: number
  totalDeltaX: number
  totalDeltaY: number
}

export interface PointerCancelEvent {
  nativeEvent: PointerEvent | KeyboardEvent
  startX: number
  startY: number
  offsetX: number
  offsetY: number
}

interface PointerDragListeners {
  onPointerDragStart?: (event: PointerDragEvent) => void
  onPointerDragMove?: (event: PointerDragEvent) => void
  onPointerDragEnd?: (event: PointerDragEvent) => void
  onPointerDragCancel?: (event: PointerCancelEvent) => void
}

interface PointerDragOptions extends PointerDragListeners {
  /**
   * The default behavior is to debounce pointer events to match the screen
   * refresh rate using `requestAnimationFrame`. This is ideal for almost all
   * UI-related use cases. The native input polling rate might be much higher
   * and cause errors such as "Maximum update depth exceeded" in React.
   */
  uncappedInputPollingRate?: boolean
}

export function createPointerDragListener(
  element: HTMLElement | null,
  options: PointerDragOptions
) {
  let dragState:
    | {
        startX: number
        startY: number
        offsetX: number
        offsetY: number
        pointerId: number
      }
    | undefined

  let rafHandle: ReturnType<typeof requestAnimationFrame> | undefined

  const onPointerDown = (nativeEvent: PointerEvent) => {
    if (dragState || !element) return
    nativeEvent.preventDefault()
    dragState = {
      startX: nativeEvent.clientX,
      startY: nativeEvent.clientY,
      offsetX: nativeEvent.offsetX,
      offsetY: nativeEvent.offsetY,
      pointerId: nativeEvent.pointerId,
    }
    element.setPointerCapture(nativeEvent.pointerId)
    element.addEventListener('pointermove', onPointerMove)
    element.addEventListener('pointercancel', onPointerCancel)
    element.addEventListener('pointerup', onPointerUp)
    window.addEventListener('keydown', onKeyDown)
    options.onPointerDragStart?.({
      nativeEvent,
      startX: nativeEvent.clientX,
      startY: nativeEvent.clientY,
      offsetX: nativeEvent.offsetX,
      offsetY: nativeEvent.offsetY,
      totalDeltaX: 0,
      totalDeltaY: 0,
    })
  }

  const onPointerMove = (nativeEvent: PointerEvent) => {
    if (!element || !dragState || dragState.pointerId !== nativeEvent.pointerId) return
    const { startX, startY, offsetX, offsetY } = dragState
    const totalDeltaX = nativeEvent.clientX - startX
    const totalDeltaY = nativeEvent.clientY - startY

    const callback = () => {
      options.onPointerDragMove?.({
        nativeEvent,
        startX,
        startY,
        offsetX,
        offsetY,
        totalDeltaX,
        totalDeltaY,
      })
    }

    if (options.uncappedInputPollingRate) {
      callback()
    } else {
      if (rafHandle) cancelAnimationFrame(rafHandle)
      rafHandle = requestAnimationFrame(callback)
    }
  }

  const onKeyDown = (nativeEvent: KeyboardEvent) => {
    if (!dragState || !element || nativeEvent.key !== 'Escape') return
    element.releasePointerCapture(dragState.pointerId)
    element.removeEventListener('pointermove', onPointerMove)
    element.removeEventListener('pointercancel', onPointerCancel)
    element.removeEventListener('pointerup', onPointerUp)
    window.removeEventListener('keydown', onKeyDown)
    if (rafHandle) rafHandle = void cancelAnimationFrame(rafHandle)
    const { startX, startY, offsetX, offsetY } = dragState
    options.onPointerDragCancel?.({
      nativeEvent,
      startX,
      startY,
      offsetX,
      offsetY,
    })
    dragState = undefined
  }

  const onPointerCancel = (nativeEvent: PointerEvent) => {
    if (!element || !dragState || dragState.pointerId !== nativeEvent.pointerId) return
    element.releasePointerCapture(nativeEvent.pointerId)
    element.removeEventListener('pointermove', onPointerMove)
    element.removeEventListener('pointercancel', onPointerCancel)
    element.removeEventListener('pointerup', onPointerUp)
    window.removeEventListener('keydown', onKeyDown)
    if (rafHandle) rafHandle = void cancelAnimationFrame(rafHandle)
    const { startX, startY, offsetX, offsetY } = dragState
    options.onPointerDragCancel?.({
      nativeEvent,
      startX,
      startY,
      offsetX,
      offsetY,
    })
    dragState = undefined
  }

  const onPointerUp = (nativeEvent: PointerEvent) => {
    if (!element || !dragState || dragState.pointerId !== nativeEvent.pointerId) return
    element.releasePointerCapture(nativeEvent.pointerId)
    element.removeEventListener('pointermove', onPointerMove)
    element.removeEventListener('pointercancel', onPointerCancel)
    element.removeEventListener('pointerup', onPointerUp)
    window.removeEventListener('keydown', onKeyDown)
    if (rafHandle) rafHandle = void cancelAnimationFrame(rafHandle)
    const { startX, startY, offsetX, offsetY } = dragState
    const totalDeltaX = nativeEvent.clientX - startX
    const totalDeltaY = nativeEvent.clientY - startY
    options.onPointerDragEnd?.({
      nativeEvent,
      startX,
      startY,
      offsetX,
      offsetY,
      totalDeltaX,
      totalDeltaY,
    })
    dragState = undefined
  }

  element?.addEventListener('pointerdown', onPointerDown)

  return {
    removeEventListener() {
      element?.removeEventListener('pointerdown', onPointerDown)
    },
  }
}

export function usePointerDragListener(
  elementRef: RefObject<HTMLElement | null>,
  options: PointerDragOptions
) {
  const optionsRef = useRef(options)
  optionsRef.current = options
  useEffect(() => {
    const listener = createPointerDragListener(elementRef.current, {
      onPointerDragStart(event) {
        optionsRef.current.onPointerDragStart?.(event)
      },
      onPointerDragMove(event) {
        optionsRef.current.onPointerDragMove?.(event)
      },
      onPointerDragEnd(event) {
        optionsRef.current.onPointerDragEnd?.(event)
      },
      onPointerDragCancel(event) {
        optionsRef.current.onPointerDragCancel?.(event)
      },
    })
    return () => listener.removeEventListener()
  }, [elementRef, optionsRef])
}

export function usePointerDragState(elementRef: RefObject<HTMLElement | null>) {
  const [dragState, setDragState] = useState<PointerDragEvent | undefined>(undefined)

  usePointerDragListener(elementRef, {
    onPointerDragStart(event) {
      setDragState(event)
    },
    onPointerDragMove(event) {
      setDragState(event)
    },
    onPointerDragEnd() {
      setDragState(undefined)
    },
    onPointerDragCancel() {
      setDragState(undefined)
    },
  })

  return useMemo(() => {
    return {
      dragging: !!dragState,
      startX: dragState?.startX ?? 0,
      startY: dragState?.startY ?? 0,
      deltaX: dragState?.totalDeltaX ?? 0,
      deltaY: dragState?.totalDeltaY ?? 0,
    }
  }, [dragState])
}
