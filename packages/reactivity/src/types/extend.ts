import type { Raw } from './raw'

export type Extended<P extends object, C extends object> = Omit<
  Raw<P>,
  keyof C
> &
  C
