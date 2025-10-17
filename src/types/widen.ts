export type Widen<T> = T extends number
  ? number
  : T extends string
  ? string
  : T extends boolean
  ? boolean
  : T extends object
  ? { -readonly [K in keyof T]: Widen<T[K]> }
  : T
