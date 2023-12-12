/**
 * Linearly interpolate between `a` and `b`,
 * with interpolation factor `t` between 0 and 1.
 */
export const lerp = (a: number, b: number, t: number) => a + t * (b - a)
