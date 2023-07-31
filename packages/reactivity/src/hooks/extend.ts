import type { Extended, Parent } from '@/types'

import { computed } from './computed'
import { unref } from './ref'

export const extend = <C extends object, P extends Parent[]>(
  child: C,
  ...parents: [...P]
): Extended<C, P> => {
  const obj = {} as Extended<C, P>

  parents.forEach(p => {
    Object.defineProperties(obj, createDescriptors(p))
  })

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
