export function createEmitter<T = void>() {
  const listeners = new Set<(event: T) => void>()
  return {
    emit(value: T) {
      listeners.forEach(listener => listener(value))
    },
    on(listener: (event: T) => void) {
      listeners.add(listener)
    },
    off(listener: (event: T) => void) {
      listeners.delete(listener)
    },
  }
}
