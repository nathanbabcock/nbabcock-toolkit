export function createEvents<TEvents extends { [K in keyof TEvents]: (...args: any[]) => any }>() {
  const handlers: { [TName in keyof TEvents]?: TEvents[TName][] } = {}

  return {
    on<TName extends keyof TEvents>(event: TName, handler: TEvents[TName]) {
      ;(handlers[event] ??= []).push(handler)
    },

    off<TName extends keyof TEvents>(event: TName, handler: TEvents[TName]) {
      const index = handlers[event]?.indexOf(handler) ?? -1
      if (index !== -1) handlers[event]!.splice(index, 1)
    },

    emit<TName extends keyof TEvents>(event: TName, ...args: Parameters<TEvents[TName]>) {
      handlers[event]?.forEach(handler => handler(...args))
    },
  }
}

// Sample usage:

// export interface Events {
//   sourcesLoaded(event: any): void
//   sourceAdded(event: any): void
//   sourceRemoved(event: any): void
// }
// const events = createEvents<Events>()
