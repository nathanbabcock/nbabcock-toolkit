/** Constrain `num` in a range between `min` and `max` (inclusive) */
export const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max)
