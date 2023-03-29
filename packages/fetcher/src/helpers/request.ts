import { FetcherAbortManager } from '@/abort-manager'
import {
  FetcherConfig,
  FetcherRequestConfig,
  FetcherRequestQuery,
} from '@/types'

export const buildRequest = (
  cfg: FetcherConfig,
  requestCfg: FetcherRequestConfig,
  abortManager: FetcherAbortManager,
): { url: string; config: RequestInit } => {
  const url = buildRequestURL(
    cfg.baseUrl,
    requestCfg.endpoint,
    requestCfg.query,
  )
  const config = buildRequestConfig(cfg, requestCfg, abortManager)

  return {
    url,
    config,
  }
}

const buildRequestURL = (
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

const buildRequestConfig = (
  cfg: FetcherConfig,
  requestCfg: FetcherRequestConfig,
  abortManager: FetcherAbortManager,
): RequestInit => {
  // TODO Add body

  return {
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
