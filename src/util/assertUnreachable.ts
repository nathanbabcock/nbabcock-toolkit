export function assertUnreachable(value: never): never {
  throw new Error(`Unhandled case: ${value}`)
}

// or, purely inline:

// const unhandledCase: never = value;
// throw new Error(`Unhandled case: ${unhandledCase}`);
