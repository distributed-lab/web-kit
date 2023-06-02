import { v4 as uuid } from 'uuid'

import { FetcherAbortManager } from '@/abort-manager'
import { DEFAULT_CONFIG } from '@/const'
import { HTTP_METHODS } from '@/enums'
import { FetcherError } from '@/error'
import { buildRequest, validateBaseUrl } from '@/helpers'
import { FetcherInterceptorManager } from '@/interceptor-manager'
import { FetcherResponseBuilder } from '@/response-builder'
import type {
  FetcherConfig,
  FetcherInterceptor,
  FetcherRequest,
  FetcherRequestConfig,
  FetcherRequestOpts,
  FetcherResponse,
} from '@/types'

export class Fetcher {
  readonly #abortManager: FetcherAbortManager
  readonly #interceptorManager: FetcherInterceptorManager

  #config: FetcherConfig

  constructor(config: FetcherConfig, interceptors?: FetcherInterceptor[]) {
    validateBaseUrl(config.baseUrl)

    this.#config = {
      ...DEFAULT_CONFIG,
      ...config,
      baseUrl: config.baseUrl,
    }

    this.#abortManager = new FetcherAbortManager()
    this.#interceptorManager = new FetcherInterceptorManager(interceptors)
  }

  public get config(): FetcherConfig {
    return this.#config
  }

  /**
   *  Base URL will be prepended to `url` unless `url` is absolute.
   *  It can be convenient to set `baseURL` for an instance of Fetcher to pass
   *  relative URLs to methods of that instance.
   */
  public get baseUrl(): string {
    return this.#config.baseUrl
  }

  /**
   * Returns the {@link FetcherAbortManager} instance.
   */
  public get abortManager(): FetcherAbortManager {
    return this.#abortManager
  }

  /**
   * Returns the {@link FetcherInterceptorManager} instance.
   */
  public get interceptorManager(): FetcherInterceptorManager {
    return this.#interceptorManager
  }

  /**
   * Clones current Fetcher instance.
   */
  public clone(): Fetcher {
    return new Fetcher(this.#config, this.#interceptorManager.interceptors)
  }

  /**
   * Sets new interceptor to the current instance.
   */
  public addInterceptor(interceptor: FetcherInterceptor): void {
    this.#interceptorManager.add(interceptor)
  }

  /**
   * Removes the existing interceptor from the current instance.
   */
  public removeInterceptor(interceptor: FetcherInterceptor): void {
    this.#interceptorManager.remove(interceptor)
  }

  /**
   * Clears all existing interceptors from the current instance.
   */
  public clearInterceptors(): void {
    this.#interceptorManager.clear()
  }

  /**
   * Assigns new base URL to the current instance.
   */
  public useBaseUrl(baseUrl: string): Fetcher {
    validateBaseUrl(baseUrl)
    this.#config.baseUrl = baseUrl
    return this
  }

  /**
   * Creates new instance Fetcher instance with given base URL.
   */
  withBaseUrl(baseUrl: string): Fetcher {
    return this.clone().useBaseUrl(baseUrl)
  }

  public updateConfig(config: Partial<FetcherConfig>): void {
    this.#config = {
      ...this.#config,
      ...config,
    }
  }

  /**
   * Interrupts the request by given `requestId`, if request is not found returns `false`.
   */
  public abort(requestId?: string): boolean {
    return this.#abortManager.abort(requestId)
  }

  /**
   * Generates new request id in the UUID format.
   */
  public createRequestId(): string {
    return uuid()
  }

  /**
   * Performs a http request.
   */
  public async request<T = unknown>(
    cfg: FetcherRequestConfig,
  ): Promise<FetcherResponse<T>> {
    let result: FetcherResponse<T>

    const reqConfig = {
      ...cfg,
      id: cfg.id || this.createRequestId(),
    }

    const req = buildRequest(this.#config, reqConfig, this.#abortManager)
    const builder = new FetcherResponseBuilder<T>(req)
    const raw = await this.#executeRequest(reqConfig.id, req)
    const response = await builder.populateResponse(raw).build()

    result = await this.#interceptorManager.runResponseInterceptors<T>(response)

    if (result.ok) return result

    result = await this.#interceptorManager.runErrorInterceptors<T>(result)

    if (!result.ok) throw new FetcherError(result as FetcherResponse<undefined>)

    return result
  }

  /**
   * Makes a `GET` to a target `endpoint` with the provided `query` params.
   */
  public get<T>(
    endpoint: string,
    opts?: FetcherRequestOpts,
  ): Promise<FetcherResponse<T>> {
    return this.request<T>({
      endpoint,
      method: HTTP_METHODS.GET,
      ...(opts || {}),
    })
  }

  /**
   * Makes a `POST` to a target `endpoint` with the provided `body`.
   */
  public post<T>(
    endpoint: string,
    opts?: FetcherRequestOpts,
  ): Promise<FetcherResponse<T>> {
    return this.request<T>({
      endpoint,
      method: HTTP_METHODS.POST,
      ...(opts || {}),
    })
  }

  /**
   * Makes a `PATCH` to a target `endpoint` with the provided `body`.
   */
  public patch<T>(
    endpoint: string,
    opts?: FetcherRequestOpts,
  ): Promise<FetcherResponse<T>> {
    return this.request<T>({
      endpoint,
      method: HTTP_METHODS.PATCH,
      ...(opts || {}),
    })
  }

  /**
   * Makes a `PUT` to a target `endpoint` with the provided `body`.
   */
  public put<T>(
    endpoint: string,
    opts?: FetcherRequestOpts,
  ): Promise<FetcherResponse<T>> {
    return this.request<T>({
      endpoint,
      method: HTTP_METHODS.PUT,
      ...(opts || {}),
    })
  }

  /**
   * Makes a `DELETE` to a target `endpoint` with the provided `body`.
   */
  public delete<T>(
    endpoint: string,
    opts?: FetcherRequestOpts,
  ): Promise<FetcherResponse<T>> {
    return this.request<T>({
      endpoint,
      method: HTTP_METHODS.DELETE,
      ...(opts || {}),
    })
  }

  async #executeRequest(id: string, request: FetcherRequest) {
    const config = await this.#interceptorManager.runRequestInterceptors(
      request,
    )
    const timeoutId = setTimeout(() => this.abort(id), this.#config.timeout)

    const response = await fetch(config.url, config)

    this.#abortManager.clear(id)
    clearTimeout(timeoutId)
    return response
  }
}
