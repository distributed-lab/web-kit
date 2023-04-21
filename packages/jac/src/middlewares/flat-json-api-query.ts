import cloneDeep from 'lodash/cloneDeep'

import { isDeeperThanOneNesting, isObject, isObjectOrArray } from '@/helpers'
import type { JsonApiClientRequestQuery } from '@/types'

/**
 * flatJsonApiQuery is needed to provide easier interface for complex query
 * params.
 */
export const flatJsonApiQuery = (
  q?: JsonApiClientRequestQuery,
): JsonApiClientRequestQuery | undefined => {
  if (!q) return

  const query = cloneDeep(q)

  if (isDeeperThanOneNesting(query)) {
    throw new TypeError(
      'Nested arrays or objects are not allowed for using in query params',
    )
  }

  return {
    ...flattenArraysOnly<JsonApiClientRequestQuery>(query),
    ...flattenObjectsOnly<JsonApiClientRequestQuery>(query),
    ...flattenPrimitivesOnly<JsonApiClientRequestQuery>(query),
  }
}

function flattenArraysOnly<T extends object>(object: T) {
  return Object.entries(object)
    .filter(([, value]) => Array.isArray(value))
    .map(([key, value]) => [key, value.join(',')])
    .reduce((res, [key, val]) => ({ ...res, ...{ [key]: val } }), {})
}

function flattenObjectsOnly<T extends object>(object: T) {
  return Object.entries(object)
    .filter(([, value]) => isObject(value))
    .map(([prefix, nestedObj]) =>
      Object.entries(nestedObj).map(([key, value]) => [
        `${prefix}[${key}]`,
        value,
      ]),
    )
    .reduce((acc, row) => acc.concat(row), [])
    .reduce((res, [key, val]) => ({ ...res, ...{ [key as string]: val } }), {})
}

function flattenPrimitivesOnly<T extends object>(object: T) {
  return Object.entries(object)
    .filter(([, value]) => !isObjectOrArray(value))
    .reduce((res, [key, val]) => ({ ...res, ...{ [key]: val } }), {})
}
