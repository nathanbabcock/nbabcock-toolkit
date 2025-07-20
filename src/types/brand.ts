declare const $brand: unique symbol

/** https://www.youtube.com/watch?v=V-fRuoMIfpw */
export type Brand<T extends string | number | symbol = string | number | symbol> = {
  [$brand]: {
    [k in T]: true
  }
}

export type Unbrand<T> = T extends Brand<any> & infer U ? U : T
