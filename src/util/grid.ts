export function createGrid<
  TCols extends CollectColNames<TString>,
  TString extends string // todo: make this baby opaque
>(template: TString) {
  const areas = new Proxy({}, { get: (_, prop) => prop }) as {
    [k in TCols]: k
  }

  // Using a Proxy is extra fancy here. We guide the user to choose only valid column
  // names as property keys using the type definition, and return them as values
  // directly at runtime. For build-time CSS-in-JS solutions, this is all we
  // need since there will be no runtime overhead. Nice!

  // Otherwise the Proxy is not strictly necessary. We could parse the string
  // "again" (this time operating on values rather than types) by using a regex,
  // or some combination of `string.split()` and `string.trim()`.

  // Return the column names and the template string unchanged
  return { areas, template }
}

// This is a type-level parser for CSS grid template strings.
// It was synthesized by Claude from a combination of several inputs:
//
// 1. A very inefficient O(n^2) character-by-character parser using a string
//    literal union of every valid character (26 lowercase + 26 uppercase + 10
//    digits + hyphens and underscores).
//
// Claude brought a key insight that Typescript's greedy parsing always matches
// a single character when using something like `${infer A}${infer B}`, `A` will
// always be the head and `B` will be the tail.
//
// 2. The `Split` and `Words` utilities from `type-fest` on Github:
//    - https://github.com/sindresorhus/type-fest/blob/main/source/split.d.ts
//    - https://github.com/sindresorhus/type-fest/blob/main/source/words.d.ts
//    - https://github.com/sindresorhus/type-fest
//
// 3. A short discussion about Typescript's greedy string inference behavior,
//    chunk-based processing from type-fest, and a backtracking mechanism.
//
// Key technique: "quote-first" parsing - find quoted sections, then process their
// contents, rather than maintaining quote state while parsing every character.

type Whitespace = ' ' | '\n' | '\t'

// Split quoted content into individual column names
type SplitColumnNames<S extends string> = S extends `${Whitespace}${infer Rest}`
  ? SplitColumnNames<Rest> // Skip leading whitespace
  : S extends `${infer Name}${Whitespace}${infer Rest}`
  ? Name extends ''
    ? SplitColumnNames<Rest>
    : [Name, ...SplitColumnNames<Rest>]
  : S extends ''
  ? []
  : [S]

// Main parser - only processes quoted sections
type ParseGridTemplate<
  S extends string,
  Names extends string[] = []
> = S extends `${string}'${infer Content}'${infer Rest}`
  ? ParseGridTemplate<Rest, [...Names, ...SplitColumnNames<Content>]>
  : S extends `${string}"${infer Content}"${infer Rest}`
  ? ParseGridTemplate<Rest, [...Names, ...SplitColumnNames<Content>]>
  : S extends `${infer _}${infer Rest}`
  ? ParseGridTemplate<Rest, Names>
  : Names

// Final result as union of column names
type CollectColNames<T extends string> = ParseGridTemplate<T> extends readonly string[]
  ? ParseGridTemplate<T>[number]
  : never
