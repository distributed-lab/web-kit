import type {
  FetcherInterceptor,
  FetcherRequestQuery,
} from '@distributedlab/fetcher'
import { Fetcher, HTTP_METHODS, FetcherError } from '@distributedlab/fetcher'

import type { JsonApiResponse } from '@/response'

import {
  flatJsonApiQuery,
  parseJsonApiError,
  parseJsonApiResponse,
  setJsonApiHeaders,
} from './middlewares'
import type {
  Endpoint,
  JsonApiClientConfig,
  JsonApiClientRequestConfig,
  JsonApiClientRequestOpts,
  JsonApiDefaultMeta,
  JsonApiResponseErrors,
  JsonApiResponseRaw,
  URL,
} from './types'

/**
 * Represents JsonApiClient that performs requests to backend
 */
export class JsonApiClient {
  #fetcher: Fetcher

  constructor(
    config: JsonApiClientConfig,
    interceptors?: FetcherInterceptor[],
  ) {
    this.#fetcher = new Fetcher(config, interceptors)
  }

  /**
   * Clones current JsonApiClient instance
   */
  public clone(): JsonApiClient {
    return new JsonApiClient(
      this.#fetcher.config,
      this.#fetcher.interceptorManager.interceptors,
    )
  }

  /**
   * Sets Fetcher instance to the client instance.
   */
  public get fetcher(): Fetcher {
    return this.#fetcher
  }

  /**
   * Sets Fetcher instance to the client instance.
   */
  public useFetcher(fetcher: Fetcher): JsonApiClient {
    this.#fetcher = fetcher
    return this
  }

  /**
   *  Base URL will be prepended to `url` unless `url` is absolute.
   *  It can be convenient to set `baseUrl` for an instance of fetcher to pass
   *  relative URLs to methods of that instance.
   */
  public get baseUrl(): URL {
    return this.#fetcher.baseUrl
  }

  /**
   * Assigns new base URL to the current instance.
   */
  useBaseUrl(baseUrl: URL): JsonApiClient {
    this.#fetcher.useBaseUrl(baseUrl)
    return this
  }

  /**
   * Creates new instance JsonApiClient instance with given base URL.
   */
  withBaseUrl(baseUrl: URL): JsonApiClient {
    return this.clone().useBaseUrl(baseUrl)
  }

  /**
   * Sets new interceptor to the current Fetcher instance.
   */
  public addInterceptor(interceptor: FetcherInterceptor): void {
    this.#fetcher.addInterceptor(interceptor)
  }

  /**
   * Removes the existing interceptor from the Fetcher instance.
   */
  public removeInterceptor(interceptor: FetcherInterceptor): void {
    this.#fetcher.removeInterceptor(interceptor)
  }

  /**
   * Clears all existing interceptors from the Fetcher instance.
   */
  public clearInterceptors(): void {
    this.#fetcher.clearInterceptors()
  }

  /**
   * Generates new request id in the UUID format.
   */
  public createRequestId(): string {
    return this.#fetcher.createRequestId()
  }

  /**
   * Interrupts the request by given `requestId`, if request is not found returns `false`.
   */
  public abort(requestId?: string): boolean {
    return this.#fetcher.abort(requestId)
  }

  /**
   * Performs a http request
   */
  async request<T, U = JsonApiDefaultMeta>(
    opts: JsonApiClientRequestOpts,
  ): Promise<JsonApiResponse<T, U>> {
    let raw: JsonApiResponseRaw

    const config: JsonApiClientRequestConfig = {
      body: opts.body,
      method: opts.method,
      query: flatJsonApiQuery(opts.query) as FetcherRequestQuery,
      headers: setJsonApiHeaders(opts?.headers ?? {}),
      endpoint: opts.endpoint,
    }

    try {
      raw = await this.#fetcher.request(config)
    } catch (e) {
      if (e instanceof FetcherError<JsonApiResponseErrors>) {
        throw parseJsonApiError(e as FetcherError<JsonApiResponseErrors>)
      }

      throw e
    }

    return parseJsonApiResponse<T, U>({
      raw,
      isNeedRaw: Boolean(opts?.isNeedRaw),
      apiClient: this,
    })
  }

  /**
   * Makes a `GET` to a target `endpoint` with the provided `query` params.
   * Parses the response in JsonApi format.
   */
  get<T, U = JsonApiDefaultMeta>(
    endpoint: Endpoint,
    opts?: Partial<JsonApiClientRequestOpts>,
  ): Promise<JsonApiResponse<T, U>> {
    return this.request<T, U>({
      method: HTTP_METHODS.GET,
      endpoint,
      ...(opts || {}),
    })
  }

  /**
   * Makes a `POST` to a target `endpoint` with the provided `data` as body.
   * Parses the response in JsonApi format.
   */
  post<T, U = JsonApiDefaultMeta>(
    endpoint: Endpoint,
    opts?: Partial<JsonApiClientRequestOpts>,
  ): Promise<JsonApiResponse<T, U>> {
    return this.request<T, U>({
      method: HTTP_METHODS.POST,
      endpoint,
      ...(opts || {}),
    })
  }

  /**
   * Makes a `PATCH` to a target `endpoint` with the provided `data` as body.
   * Signing can be enabled with `needSign` argument. Parses the response in
   * JsonApi format.
   */
  patch<T, U = JsonApiDefaultMeta>(
    endpoint: string,
    opts?: Partial<JsonApiClientRequestOpts>,
  ): Promise<JsonApiResponse<T, U>> {
    return this.request<T, U>({
      method: HTTP_METHODS.PATCH,
      endpoint,
      ...(opts || {}),
    })
  }

  /**
   * Makes a `PUT` to a target `endpoint` with the provided `data` as body.
   * Parses the response in JsonApi format.
   */
  put<T, U = JsonApiDefaultMeta>(
    endpoint: string,
    opts?: Partial<JsonApiClientRequestOpts>,
  ): Promise<JsonApiResponse<T, U>> {
    return this.request<T, U>({
      method: HTTP_METHODS.PUT,
      endpoint,
      ...(opts || {}),
    })
  }

  /**
   * Makes a `DELETE` to a target `endpoint` with the provided `data` as body.
   * Parses the response in JsonApi format.
   */
  delete<T, U = JsonApiDefaultMeta>(
    endpoint: string,
    opts?: Partial<JsonApiClientRequestOpts>,
  ): Promise<JsonApiResponse<T, U>> {
    return this.request<T, U>({
      method: HTTP_METHODS.DELETE,
      endpoint,
      ...(opts || {}),
    })
  }
}
