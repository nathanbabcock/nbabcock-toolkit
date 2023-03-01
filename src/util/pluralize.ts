/** naive pluralize function (just appends an 's' when needed) */
export default function pluralize(singular: string, count: number): string {
  return `${singular}${count !== 1 ? 's' : ''}`
}
