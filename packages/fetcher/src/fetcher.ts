import { computed, ref, toRaw } from '@distributedlab/reactivity'
import { v4 as uuid } from 'uuid'

import { newFetcherAbortManager } from '@/abort-manager'
import { DEFAULT_CONFIG } from '@/const'
import { HTTP_METHODS } from '@/enums'
import { FetcherError } from '@/error'
import { buildRequest, validateBaseUrl } from '@/helpers'
import { newFetcherInterceptorManager } from '@/interceptor-manager'
import { newFetcherResponseBuilder } from '@/response-builder'
import type {
  Fetcher,
  FetcherConfig,
  FetcherInterceptor,
  FetcherRequest,
  FetcherRequestConfig,
  FetcherRequestOpts,
  FetcherResponse,
} from '@/types'

export const newFetcher = (
  cfg: FetcherConfig,
  intrs?: FetcherInterceptor[],
): Fetcher => {
  validateBaseUrl(cfg.baseUrl)

  const config = ref<FetcherConfig>({
    ...DEFAULT_CONFIG,
    ...cfg,
    baseUrl: cfg.baseUrl,
  })
  const abortManager = newFetcherAbortManager()
  const interceptorManager = newFetcherInterceptorManager(intrs)

  const clone = () => {
    return newFetcher(config.value, interceptorManager.interceptors)
  }

  const addInterceptor = (i: FetcherInterceptor) => {
    interceptorManager.add(i)
  }

  const removeInterceptor = (i: FetcherInterceptor) => {
    interceptorManager.remove(i)
  }

  const clearInterceptors = () => {
    interceptorManager.clear()
  }

  const useBaseUrl = (baseUrl: string) => {
    validateBaseUrl(baseUrl)
    config.value.baseUrl = baseUrl
    return fetcher
  }

  const withBaseUrl = (baseUrl: string) => {
    return clone().useBaseUrl(baseUrl)
  }

  const updateConfig = (cfg: Partial<FetcherConfig>) => {
    config.value = {
      ...config.value,
      ...cfg,
    }
  }

  const abort = (requestId?: string) => {
    return abortManager.abort(requestId)
  }

  const createRequestId = () => uuid()

  const request = async <T = unknown>(cfg: FetcherRequestConfig) => {
    let result: FetcherResponse<T>

    const reqConfig = {
      ...cfg,
      id: cfg.id || createRequestId(),
    }

    const req = buildRequest(config.value, reqConfig, abortManager)
    const builder = newFetcherResponseBuilder<T>(req)
    const raw = await executeRequest(reqConfig.id, req)
    const response = await builder.populateResponse(raw).build()

    result = await interceptorManager.runResponseInterceptors<T>(response)

    if (result.ok) return result

    result = await interceptorManager.runErrorInterceptors<T>(result)

    if (!result.ok) throw new FetcherError(result as FetcherResponse<undefined>)

    return result
  }

  const get = async <T>(endpoint: string, opts?: FetcherRequestOpts) => {
    return request<T>({
      endpoint,
      method: HTTP_METHODS.GET,
      ...(opts || {}),
    })
  }

  const post = async <T>(endpoint: string, opts?: FetcherRequestOpts) => {
    return request<T>({
      endpoint,
      method: HTTP_METHODS.POST,
      ...(opts || {}),
    })
  }

  const patch = async <T>(endpoint: string, opts?: FetcherRequestOpts) => {
    return request<T>({
      endpoint,
      method: HTTP_METHODS.PATCH,
      ...(opts || {}),
    })
  }

  const put = async <T>(endpoint: string, opts?: FetcherRequestOpts) => {
    return request<T>({
      endpoint,
      method: HTTP_METHODS.PUT,
      ...(opts || {}),
    })
  }

  const _delete = async <T>(endpoint: string, opts?: FetcherRequestOpts) => {
    return request<T>({
      endpoint,
      method: HTTP_METHODS.DELETE,
      ...(opts || {}),
    })
  }

  const executeRequest = async (id: string, request: FetcherRequest) => {
    const cfg = await interceptorManager.runRequestInterceptors(request)
    const timeoutId = setTimeout(() => abort(id), config.value.timeout)

    const response = await fetch(cfg.url, cfg)

    abortManager.clear(id)
    clearTimeout(timeoutId)
    return response
  }

  const fetcher = toRaw({
    config,
    baseUrl: computed(() => config.value.baseUrl),
    abortManager,
    interceptorManager,
    clone,
    addInterceptor,
    removeInterceptor,
    clearInterceptors,
    useBaseUrl,
    withBaseUrl,
    updateConfig,
    abort,
    createRequestId,
    request,
    get,
    post,
    patch,
    put,
    delete: _delete,
  })

  return fetcher
}
