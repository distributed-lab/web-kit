import type { Computed, ComputedGetter, MaybeComputed } from '@/types'

export class ComputedImpl<T> {
  readonly #getter: ComputedGetter<T>

  constructor(getter: ComputedGetter<T>) {
    this.#getter = getter
  }

  get value(): T {
    return this.#getter()
  }
}

export const computed = <T>(getter: ComputedGetter<T>): Computed<T> => {
  return new ComputedImpl<T>(getter)
}

export const isComputed = <T>(
  value: MaybeComputed<T>,
): value is Computed<T> => {
  return value instanceof ComputedImpl
}
