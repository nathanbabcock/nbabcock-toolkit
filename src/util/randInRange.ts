/** @returns a random integer between min and max (both inclusive) */
export default function randInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
