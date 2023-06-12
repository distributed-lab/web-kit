import { ref, toRaw } from '@distributedlab/reactivity'

import type { FetcherAbortManager } from '@/types'

export const newFetcherAbortManager = (): FetcherAbortManager => {
  const controllers = ref<Map<string, AbortController>>(new Map())

  const get = (requestId: string) => {
    return controllers.value.get(requestId)
  }

  const set = (requestId: string) => {
    const controller = new AbortController()
    controllers.value.set(requestId, controller)
    return controller
  }

  const setSafe = (requestId?: string) => {
    if (!requestId) return null
    return set(requestId).signal
  }

  const has = (requestId: string) => {
    return controllers.value.has(requestId)
  }

  const clear = (requestId?: string) => {
    return controllers.value.delete(requestId ?? '')
  }

  const abort = (requestId?: string) => {
    const id = requestId ?? ''

    if (!id || !has(id)) return false

    const controller = get(id)!
    controller.abort()
    return clear(id)
  }

  return toRaw({
    controllers,
    get,
    set,
    setSafe,
    has,
    clear,
    abort,
  })
}
