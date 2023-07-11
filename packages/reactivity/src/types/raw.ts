import type { Computed } from './computed'
import type { Ref } from './ref'

export type ComputedOrRef<T = unknown> = Ref<T> | Computed<T>

export type Unwrap<T> = T extends ComputedOrRef<infer V> ? V : T

export type Raw<T> = {
  [K in keyof T]: Unwrap<T[K]>
}
