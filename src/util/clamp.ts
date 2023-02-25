const clamp = (num: number, [min, max]: [number, number]) =>
  Math.min(Math.max(num, min), max)
export default clamp
