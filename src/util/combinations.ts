/**
 * Given a 2D array, return a flat array with all possible  combinations of the sub-arrays.
 * 
 * ```ts
 * // Input:
 * const array2D = [
 *   ['red', 'blue'],
 *   ['cotton','polyester','silk'],
 *   ['large','medium','small']
 * ]
 * 
 * // Output:
 * const combos = combinations(array2D) === [
 *   ['red', 'cotton', 'large'],
 *   ['red', 'cotton', 'medium'],
 *   ['red', 'cotton', 'small'],
 *   ['red', 'polyester', 'large'],
 *   // .
 *   // .
 *   // .
 * ] // === true
 * ```
 */
export function combinations(array2d: any[][], n = 0, result: any[] = [], current: any[] = []) {
  if (n === array2d.length) result.push(current)
  else array2d[n].forEach(item => combinations(array2d, n + 1, result, [...current, item]))
  return result
}
