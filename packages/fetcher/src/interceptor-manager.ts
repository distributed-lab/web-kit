import { ref, toRaw } from '@distributedlab/reactivity'

import type {
  FetcherInterceptor,
  FetcherInterceptorManager,
  FetcherRequest,
  FetcherResponse,
} from '@/types'

export const newFetcherInterceptorManager = (
  args: FetcherInterceptor[] = [],
): FetcherInterceptorManager => {
  const interceptors = ref<FetcherInterceptor[]>(args)

  const add = (i: FetcherInterceptor) => {
    interceptors.value.push(i)
  }

  const remove = (interceptor: FetcherInterceptor) => {
    const index = interceptors.value.indexOf(interceptor)
    if (!~index) return
    interceptors.value.splice(index, 1)
  }

  const clear = () => {
    interceptors.value = []
  }

  const runRequestInterceptors = async (request: FetcherRequest) => {
    let req = request

    for (const interceptor of interceptors.value) {
      if (interceptor.request) {
        req = await interceptor.request(req)
      }
    }

    return req
  }

  const runResponseInterceptors = async <T>(response: FetcherResponse<T>) => {
    return _runResponseInterceptors(response, 'response')
  }

  const runErrorInterceptors = async <T>(response: FetcherResponse<T>) => {
    return _runResponseInterceptors(response, 'error')
  }

  const _runResponseInterceptors = async <T>(
    response: FetcherResponse<T>,
    fnName: 'response' | 'error',
  ) => {
    let resp = response

    for (const interceptor of interceptors.value) {
      const fn = interceptor[fnName]
      if (fn) resp = (await fn(resp)) as FetcherResponse<T>
    }

    return resp
  }

  return toRaw({
    interceptors,
    add,
    remove,
    clear,
    runRequestInterceptors,
    runResponseInterceptors,
    runErrorInterceptors,
  })
}
