/**
 * ```
 * pluralize(0, "apple") === "0 apples"
 * pluralize(1, "orange") === "1 orange"
 * pluralize(2, "banana") === "2 bananas"
 * ```
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  return `${count} ${count !== 1 ? plural ?? `${singular}s` : singular}`
}
