import { DEFAULT_CONFIG } from '@/const'
import { HTTP_METHODS } from '@/enums'
import { isEmptyBodyStatusCode } from '@/helpers'
import {
  FetcherConfig,
  FetcherRequestConfig,
  FetcherRequestOpts,
  FetcherResponse,
} from '@/types'

export class Fetcher {
  readonly #config: FetcherConfig
  readonly #controllers: Map<string, AbortController>

  constructor(config: FetcherConfig) {
    this.#config = {
      ...DEFAULT_CONFIG,
      ...config,
    }

    this.#controllers = new Map()
  }

  public get config(): FetcherConfig {
    return this.#config
  }

  public async request<T = unknown>(
    cfg: FetcherRequestConfig,
  ): Promise<FetcherResponse<T>> {
    const req = this.#buildRequest(cfg)
    const url = this.#buildRequestURL(cfg)

    // try {
    const response = await fetch(url, req)

    const result: FetcherResponse<T> = {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      url: response.url,
      request: {
        url,
        ...req,
      },
    }

    if (isEmptyBodyStatusCode(response.status)) {
      this.#clearController(cfg.requestId)
      return result
    }

    result.data = await response.json()
    this.#clearController(cfg.requestId) // build result once and clear controller once

    return result
    // } catch (e) {
    //   throw e
    // }
  }

  public abort(requestId: string): boolean {
    if (!this.#controllers.has(requestId)) return false

    this.#controllers.get(requestId)!.abort()
    return this.#controllers.delete(requestId)
  }

  public get<T>(
    endpoint: string,
    query: Record<string, string> = {},
    opts: FetcherRequestOpts = {},
  ): Promise<FetcherResponse<T>> {
    return this.request<T>({
      endpoint,
      query,
      method: HTTP_METHODS.GET,
      ...opts,
    })
  }

  #clearController(requestId?: string): void {
    if (!requestId) return
    if (!this.#controllers.has(requestId)) return
    this.#controllers.delete(requestId)
  }

  #buildRequestURL(requestCfg: FetcherRequestConfig): string {
    const { endpoint } = requestCfg
    const { baseUrl } = this.#config

    // TODO Add query params to url
    return new URL(endpoint, baseUrl).toString()
  }

  #buildRequest(requestCfg: FetcherRequestConfig): RequestInit {
    // TODO Add body
    const requestId = requestCfg.requestId
    const cfg = this.#config

    if (requestId) this.#controllers.set(requestId, new AbortController())

    return {
      credentials: cfg.credentials,
      cache: cfg.cache,
      referrer: cfg.referrer,
      referrerPolicy: cfg.referrerPolicy,
      signal: requestId ? this.#controllers.get(requestId)!.signal : null,
      headers: {
        ...cfg.headers,
        ...requestCfg.headers,
      },
    }
  }
}
