export type ComputedGetter<T = unknown> = () => T

export type Computed<T = unknown> = {
  value: T
}

export type MaybeComputed<T = unknown> = T | Computed<T>
