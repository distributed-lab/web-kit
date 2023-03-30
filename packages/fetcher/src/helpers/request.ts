import { FetcherAbortManager } from '@/abort-manager'
import { isObject } from '@/helpers/is-object'
import {
  FetcherConfig,
  FetcherRequest,
  FetcherRequestBody,
  FetcherRequestConfig,
  FetcherRequestQuery,
} from '@/types'

export const buildRequest = (
  cfg: FetcherConfig,
  requestCfg: FetcherRequestConfig,
  abortManager: FetcherAbortManager,
): FetcherRequest => {
  const url = buildRequestURL(
    cfg.baseUrl,
    requestCfg.endpoint,
    requestCfg.query,
  )
  const config = buildRequestConfig(cfg, requestCfg, abortManager)

  return {
    ...config,
    url,
  }
}

export const buildRequestURL = (
  baseUrl: string,
  endpoint: string,
  query?: FetcherRequestQuery,
): string => {
  const url = new URL(endpoint, baseUrl)

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      url.searchParams.append(key, value.toString())
    })
  }

  return url.toString()
}

export const buildRequestConfig = (
  cfg: FetcherConfig,
  requestCfg: FetcherRequestConfig,
  abortManager: FetcherAbortManager,
): RequestInit => {
  return {
    body: buildRequestBody(requestCfg.body),
    credentials: cfg.credentials,
    cache: cfg.cache,
    referrer: cfg.referrer,
    referrerPolicy: cfg.referrerPolicy,
    signal: abortManager.setSafe(requestCfg.id),
    headers: {
      ...cfg.headers,
      ...requestCfg.headers,
    },
  }
}

export const buildRequestBody = (
  body?: FetcherRequestBody,
): BodyInit | null => {
  if (!body) return null

  // TODO: Add support for FormData, Blob, ArrayBuffer, ArrayBufferView
  if (isObject(body)) {
    return JSON.stringify(body)
  }

  return body as BodyInit
}
