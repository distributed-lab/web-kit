import type { Raw } from '@/types'

import { computed } from './computed'
import { unref } from './ref'

export const extend = <P extends object, C extends object>(
  parent: Raw<P>,
  child: C,
): Raw<P> & C => {
  const obj = {} as Raw<P> & C

  Object.defineProperties(obj, createDescriptors(parent))
  Object.defineProperties(obj, createDescriptors(child))

  return obj
}

const createDescriptors = <T extends object>(obj: T) => {
  return Object.entries(obj).reduce<PropertyDescriptorMap & ThisType<T>>(
    (acc, [k, v]) => {
      const result: PropertyDescriptor = {
        value: computed(() => unref(obj[k as keyof T])),
        enumerable: true,
        configurable: true,
      }

      if (typeof v === 'function') result.value = v.bind(obj)

      acc[k] = result

      return acc
    },
    {},
  )
}
