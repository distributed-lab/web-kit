import { v4 as uuid } from 'uuid'

import { FetcherAbortManager } from '@/abort-manager'
import { DEFAULT_CONFIG } from '@/const'
import { HTTP_METHODS } from '@/enums'
import { FetcherError } from '@/error'
import { buildRequest } from '@/helpers'
import { FetcherInterceptorManager } from '@/interceptor-manager'
import { FetcherResponseBuilder } from '@/response-builder'
import {
  FetcherConfig,
  FetcherInterceptor,
  FetcherRequest,
  FetcherRequestBody,
  FetcherRequestConfig,
  FetcherRequestOpts,
  FetcherRequestQuery,
  FetcherResponse,
} from '@/types'

export class Fetcher {
  readonly #abortManager: FetcherAbortManager
  readonly #interceptorManager: FetcherInterceptorManager

  #config: FetcherConfig

  constructor(config: FetcherConfig, interceptors?: FetcherInterceptor[]) {
    this.#config = {
      ...DEFAULT_CONFIG,
      ...config,
    }

    this.#abortManager = new FetcherAbortManager()
    this.#interceptorManager = new FetcherInterceptorManager(interceptors)
  }

  public get config(): FetcherConfig {
    return this.#config
  }

  public get baseUrl(): string {
    return this.#config.baseUrl
  }

  public get abortManager(): FetcherAbortManager {
    return this.#abortManager
  }

  public get interceptorManager(): FetcherInterceptorManager {
    return this.#interceptorManager
  }

  public useInterceptor(interceptor: FetcherInterceptor): void {
    this.#interceptorManager.use(interceptor)
  }

  public ejectInterceptor(interceptor: FetcherInterceptor): void {
    this.#interceptorManager.eject(interceptor)
  }

  public useBaseUrl(baseUrl: string): void {
    this.#config.baseUrl = baseUrl
  }

  public updateConfig(config: Partial<FetcherConfig>): void {
    this.#config = {
      ...this.#config,
      ...config,
    }
  }

  public abort(requestId?: string): boolean {
    return this.#abortManager.abort(requestId)
  }

  public createRequestId(): string {
    return uuid()
  }

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

  public get<T>(
    endpoint: string,
    query?: FetcherRequestQuery,
    opts?: FetcherRequestOpts,
  ): Promise<FetcherResponse<T>> {
    return this.request<T>({
      endpoint,
      query: query || {},
      method: HTTP_METHODS.GET,
      ...(opts || {}),
    })
  }

  public post<T>(
    endpoint: string,
    body?: FetcherRequestBody,
    opts?: FetcherRequestOpts,
  ): Promise<FetcherResponse<T>> {
    return this.request<T>({
      endpoint,
      body,
      method: HTTP_METHODS.POST,
      ...(opts || {}),
    })
  }

  public patch<T>(
    endpoint: string,
    body?: FetcherRequestBody,
    opts?: FetcherRequestOpts,
  ): Promise<FetcherResponse<T>> {
    return this.request<T>({
      endpoint,
      body,
      method: HTTP_METHODS.PATCH,
      ...(opts || {}),
    })
  }

  public put<T>(
    endpoint: string,
    body?: FetcherRequestBody,
    opts?: FetcherRequestOpts,
  ): Promise<FetcherResponse<T>> {
    return this.request<T>({
      endpoint,
      body,
      method: HTTP_METHODS.PUT,
      ...(opts || {}),
    })
  }

  public delete<T>(
    endpoint: string,
    body?: FetcherRequestBody,
    opts?: FetcherRequestOpts,
  ): Promise<FetcherResponse<T>> {
    return this.request<T>({
      endpoint,
      body,
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
