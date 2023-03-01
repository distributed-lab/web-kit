import cloneDeep from 'lodash/cloneDeep'

import { isDeeperThanOneNesting, isObject, isObjectOrArray } from '@/helpers'
import { JsonApiClientRequestConfig, JsonApiClientRequestParams } from '@/types'

/**
 * flattenToAxiosJsonApiQuery is needed to provide easier interface for complex query
 * params.
 */
export const flattenToAxiosJsonApiQuery = (
  requestConfig: JsonApiClientRequestConfig,
): JsonApiClientRequestParams => {
  const config = cloneDeep(requestConfig)

  if (isDeeperThanOneNesting(config.params)) {
    throw new Error(
      'Nested arrays or objects are not allowed for using in query params',
    )
  }

  config.params = {
    ...flattenArraysOnly(config.params),
    ...flattenObjectsOnly(config.params),
    ...flattenPrimitivesOnly(config.params),
  }

  return config.params
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
