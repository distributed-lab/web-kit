export type Ref<T = unknown> = {
  value: T
}

export type MaybeRef<T = unknown> = T | Ref<T>
