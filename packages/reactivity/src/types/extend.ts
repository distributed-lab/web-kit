// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Parent<T = any> = T

export type UnionToIntersection<U> = (
  U extends object ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never

export type Extended<C extends object, P extends readonly Parent[]> = C &
  Omit<UnionToIntersection<P[number]>, keyof C>
