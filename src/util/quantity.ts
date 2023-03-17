export function quantity(
  count: number,
  singular: string,
  plural?: string
): string {
  return `${count} ${count !== 1 ? plural ?? `${singular}s` : singular}`
}
