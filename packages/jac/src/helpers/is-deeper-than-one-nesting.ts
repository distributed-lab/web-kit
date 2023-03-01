import { isObjectOrArray } from '@/helpers/type-checks'

export function isDeeperThanOneNesting<T extends object>(
  object = {} as T,
): boolean {
  return Object.values(object)
    .filter(value => isObjectOrArray(value))
    .reduce((acc: T[], cur: T) => acc.concat(Object.values(cur)), [])
    .some((value: T) => isObjectOrArray(value))
}
