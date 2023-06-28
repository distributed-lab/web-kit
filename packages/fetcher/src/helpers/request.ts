import type { FetcherAbortManager } from '@/abort-manager'
import { HEADER_CONTENT_TYPE } from '@/const'
import type {
  FetcherConfig,
  FetcherRequest,
  FetcherRequestBody,
  FetcherRequestConfig,
  FetcherRequestQuery,
} from '@/types'

import { isObject } from './is-object'
import { normalizeHeadersCase } from './normalize-header-case'

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
  const parsedUrl = new URL(baseUrl)

  // To parse query params from endpoint correctly, we need to reparse it
  // otherwise query params could be serialized incorrectly
  // (ex. "?" symbol will be encoded to "%3F")
  const url = new URL(
    [parsedUrl.origin, parsedUrl.pathname, endpoint]
      .join('/')
      .replace(/\/\/+/g, '/') // replace doubled slashes
      .replace(/\/+$/, ''), // remove slash in the end
  )

  if (!query) return url.toString()

  Object.entries(query).forEach(([key, value]) => {
    validateQueryValue(value)
    url.searchParams.append(key, value.toString())
  })

  return url.toString()
}

const validateQueryValue = (value: unknown): void => {
  if (!isObject(value)) return
  throw new TypeError("Fetcher: query parameters can't have nested objects.")
}

export const buildRequestConfig = (
  cfg: FetcherConfig,
  requestCfg: FetcherRequestConfig,
  abortManager: FetcherAbortManager,
): RequestInit => {
  const body = buildRequestBody(requestCfg.body)

  const headers = normalizeHeadersCase({
    ...cfg.headers,
    ...requestCfg.headers,
  }) as Record<string, string>

  if (body instanceof FormData && headers[HEADER_CONTENT_TYPE]) {
    // FormData will set the Content-Type header automatically
    // https://stackoverflow.com/questions/39280438/fetch-missing-boundary-in-multipart-form-data-post
    delete headers[HEADER_CONTENT_TYPE]
  }

  return {
    body,
    headers,
    method: requestCfg.method,
    credentials: cfg.credentials,
    cache: cfg.cache,
    referrerPolicy: cfg.referrerPolicy,
    signal: abortManager.setSafe(requestCfg.id),
    ...(cfg.referrer ? { referrer: cfg.referrer } : {}),
  }
}

export const buildRequestBody = (
  body?: FetcherRequestBody,
): BodyInit | null => {
  if (!body) return null

  if (isObject(body)) {
    return JSON.stringify(body)
  }

  return body as BodyInit
}
