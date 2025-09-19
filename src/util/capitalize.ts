export function capitalize<T extends string>(text: T): Capitalize<T> {
  return `${text.at(0)?.toUpperCase()}${text.slice(1)}` as Capitalize<T>
}
