/**
 * ```
 * quantity(0, "apple") === "0 apples"
 * quantity(1, "orange") === "1 orange"
 * quantity(2, "banana") === "2 bananas"
 * ```
 */
export function quantity(
  count: number,
  singular: string,
  plural?: string
): string {
  return `${count} ${count !== 1 ? plural ?? `${singular}s` : singular}`
}
