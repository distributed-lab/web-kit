import { FetcherAbortManager } from '@/abort-manager'
import { HEADER_CONTENT_TYPE } from '@/const'
import { isObject, normalizeHeadersCase } from '@/helpers'
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
      if (isObject(value)) {
        throw new TypeError(
          "Fetcher: query parameters can't have nested objects.",
        )
      }

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
