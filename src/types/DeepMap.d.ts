type JSONPrimitive = string | number | boolean | null
export type DeepMap<A, B> = { [K in keyof A]: A[K] extends JSONPrimitive ? B : DeepMap<A[K], B> }
