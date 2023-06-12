import type { HTTP_METHODS } from '@/enums'

import type { FetcherAbortManager } from './abort-manager'
import type {
  FetcherInterceptor,
  FetcherInterceptorManager,
} from './interceptor'

export type FetcherConfig = {
  baseUrl: string
  credentials?: RequestCredentials
  cache?: RequestCache
  headers?: HeadersInit
  mode?: RequestMode
  referrer?: string
  referrerPolicy?: ReferrerPolicy
  timeout?: number
}

export type FetcherRequestOpts = {
  headers?: HeadersInit
  id?: string
  query?: FetcherRequestQuery
  body?: FetcherRequestBody
}

export type FetcherRequestQueryValue = string | number | boolean

export type FetcherRequestQuery = Record<
  string,
  FetcherRequestQueryValue | FetcherRequestQueryValue[]
>

export type FetcherRequestBody =
  | ReadableStream
  | Blob
  | BufferSource
  | FormData
  | string
  | object

export type FetcherRequestConfig = FetcherRequestOpts & {
  endpoint: string
  method: HTTP_METHODS
}

export type FetcherRequest = { url: string } & RequestInit

export type FetcherResponse<T> = {
  ok: boolean
  status: number
  statusText: string
  headers: Headers
  url: string
  request: FetcherRequest
  data?: T
}

export type FetcherStandaloneConfig = Omit<FetcherConfig, 'baseUrl'>

export interface Fetcher {
  /**
   * Returns current fetcher {@link FetcherConfig} config.
   */
  readonly config: FetcherConfig
  /**
   *  Base URL will be prepended to `url` unless `url` is absolute.
   *  It can be convenient to set `baseURL` for an instance of Fetcher to pass
   *  relative URLs to methods of that instance.
   */
  readonly baseUrl: string
  /**
   * Returns the {@link FetcherAbortManager} instance.
   */
  readonly abortManager: FetcherAbortManager
  /**
   * Returns the {@link FetcherInterceptorManager} instance.
   */
  readonly interceptorManager: FetcherInterceptorManager
  /**
   * Clones current Fetcher instance.
   */
  clone(): Fetcher
  /**
   * Sets new interceptor to the current instance.
   */
  addInterceptor(interceptor: FetcherInterceptor): void
  /**
   * Removes the existing interceptor from the current instance.
   */
  removeInterceptor(interceptor: FetcherInterceptor): void
  /**
   * Clears all existing interceptors from the current instance.
   */
  clearInterceptors(): void
  /**
   * Generates new unique request ID in the UUID format.
   */
  createRequestId(): string
  /**
   * Assigns new base URL to the current instance.
   */
  useBaseUrl(baseUrl: string): Fetcher
  /**
   * Creates new instance Fetcher instance with given base URL.
   */
  withBaseUrl(baseUrl: string): Fetcher
  /**
   * Updates current Fetcher config
   */
  updateConfig(config: Partial<FetcherConfig>): void
  /**
   * Interrupts the request by given `requestId`, if request is not found returns `false`.
   */
  abort(requestId?: string): boolean
  /**
   * Performs a http request.
   */
  request<T = unknown>(cfg: FetcherRequestConfig): Promise<FetcherResponse<T>>
  /**
   * Makes a `GET` to a target `endpoint` with the provided `query` params.
   */
  get<T>(
    endpoint: string,
    opts?: FetcherRequestOpts,
  ): Promise<FetcherResponse<T>>
  /**
   * Makes a `POST` to a target `endpoint` with the provided `body`.
   */
  post<T>(
    endpoint: string,
    opts?: FetcherRequestOpts,
  ): Promise<FetcherResponse<T>>
  /**
   * Makes a `PATCH` to a target `endpoint` with the provided `body`.
   */
  patch<T>(
    endpoint: string,
    opts?: FetcherRequestOpts,
  ): Promise<FetcherResponse<T>>
  /**
   * Makes a `PUT` to a target `endpoint` with the provided `body`.
   */
  put<T>(
    endpoint: string,
    opts?: FetcherRequestOpts,
  ): Promise<FetcherResponse<T>>
  /**
   * Makes a `DELETE` to a target `endpoint` with the provided `body`.
   */
  delete<T>(
    endpoint: string,
    opts?: FetcherRequestOpts,
  ): Promise<FetcherResponse<T>>
}
