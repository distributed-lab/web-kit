import type { Raw } from '@/types'

import { computed } from './computed'
import { unref } from './ref'

export const extend = <T extends object, P extends object>(
  parent: Raw<P>,
  child: T,
): T & Raw<P> => {
  const obj = {} as T & Raw<P>

  Object.defineProperties(obj, createDescriptors(parent))
  Object.defineProperties(obj, createDescriptors(child))

  return obj
}

const createDescriptors = <T extends object>(obj: T) => {
  return Object.entries(obj).reduce<PropertyDescriptorMap & ThisType<T>>(
    (acc, [k, v]) => {
      let result: PropertyDescriptor = {
        value: computed(() => unref(obj[k as keyof T])),
        enumerable: true,
      }

      if (typeof v === 'function') {
        result = { value: v.bind(obj), enumerable: true }
      }

      acc[k] = result
      return acc
    },
    {},
  )
}
