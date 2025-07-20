function error<const E extends string>(error: E) {
  return { ok: false, error } as Result.Error<E>
}

function ok(): Result.Okay<void>
function ok<T>(value: T): Result.Okay<T>
function ok<T>(value?: T): Result.Okay<T> {
  return { ok: true, value } as Result.Okay<T>
}

export const Result = { ok, error }

export namespace Result {
  export type Error<E> = { ok: false; error: E; value: never }
  export type Okay<T> = { ok: true; value: T; error: never }
}

export type Result<T = any, E = any> = Result.Okay<T> | Result.Error<E>

export type Okayed<R extends Result> = R extends Result.Okay<infer T> ? T : never
export type Errored<R extends Result> = R extends Result.Error<infer E> ? E : never
