import { HTTP_METHODS } from '@/enums'
import { FetcherURLParseError } from '@/error'
import { Fetcher } from '@/fetcher'
import { extractQueryParams } from '@/helpers'
import type {
  FetcherRequestOpts,
  FetcherResponse,
  FetcherStandaloneConfig,
} from '@/types'

const parseUrl = (u: string): URL => {
  try {
    return new URL(u)
  } catch (e) {
    throw new FetcherURLParseError(e as Error)
  }
}

const performRequest = async <T>(
  u: URL,
  method: HTTP_METHODS,
  cfg: FetcherStandaloneConfig,
  opts?: FetcherRequestOpts,
  reqCfg?: FetcherStandaloneConfig,
): Promise<FetcherResponse<T>> => {
  return new Fetcher({
    ...cfg,
    ...(reqCfg ? reqCfg : {}),
    baseUrl: u.origin,
  }).request<T>({
    endpoint: u.pathname,
    method,
    ...{
      ...(opts || {}),
      query: {
        ...opts?.query,
        ...extractQueryParams(u),
      },
    },
  })
}

export const fetcher = {
  config: {} as FetcherStandaloneConfig,

  setConfig(cfg: FetcherStandaloneConfig): void {
    this.config = { ...this.config, ...cfg }
  },

  get<T>(
    u: string,
    opts?: FetcherRequestOpts,
    cfg?: FetcherStandaloneConfig,
  ): Promise<FetcherResponse<T>> {
    return performRequest(parseUrl(u), HTTP_METHODS.GET, this.config, opts, cfg)
  },

  post<T>(
    u: string,
    opts?: FetcherRequestOpts,
    cfg?: FetcherStandaloneConfig,
  ): Promise<FetcherResponse<T>> {
    return performRequest(
      parseUrl(u),
      HTTP_METHODS.POST,
      this.config,
      opts,
      cfg,
    )
  },

  patch<T>(
    u: string,
    opts?: FetcherRequestOpts,
    cfg?: FetcherStandaloneConfig,
  ): Promise<FetcherResponse<T>> {
    return performRequest(
      parseUrl(u),
      HTTP_METHODS.PATCH,
      this.config,
      opts,
      cfg,
    )
  },

  put<T>(
    u: string,
    opts?: FetcherRequestOpts,
    cfg?: FetcherStandaloneConfig,
  ): Promise<FetcherResponse<T>> {
    return performRequest(parseUrl(u), HTTP_METHODS.PUT, this.config, opts, cfg)
  },

  delete<T>(
    u: string,
    opts?: FetcherRequestOpts,
    cfg?: FetcherStandaloneConfig,
  ): Promise<FetcherResponse<T>> {
    return performRequest(
      parseUrl(u),
      HTTP_METHODS.DELETE,
      this.config,
      opts,
      cfg,
    )
  },
}
