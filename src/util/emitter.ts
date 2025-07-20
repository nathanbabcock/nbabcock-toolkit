export function emitter() {
  let listeners = new Set<() => void>()
  return {
    emit() {
      listeners.forEach(listener => listener())
    },
    on(listener: () => void) {
      listeners.add(listener)
    },
    off(listener: () => void) {
      listeners.delete(listener)
    },
  }
}
