export type Ref<T = unknown> = {
  value: T
}

export type MaybeRef<T = unknown> = T | Ref<T>

export type RefFunction = {
  <T extends Ref>(value: T): T
  <T>(value: T): Ref<T>
  <T>(): Ref<T | undefined>
}
