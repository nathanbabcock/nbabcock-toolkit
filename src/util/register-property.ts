import { Prettify } from '../types/prettify'

/** Build up an object's properties incrementally while maintaining typesafety */
export function registerProperty<T extends Record<string, any>, U extends Record<string, any>>(
  api: T,
  exports: U
): asserts api is Prettify<T & U> {
  Object.assign(api, exports)
}
