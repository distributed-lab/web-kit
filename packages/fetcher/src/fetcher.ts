import { FetcherAbortManager } from '@/abort-manager'
import { DEFAULT_CONFIG } from '@/const'
import { HTTP_METHODS } from '@/enums'
import { buildRequest } from '@/helpers'
import { FetcherResponseBuilder } from '@/response-builder'
import {
  FetcherConfig,
  FetcherRequestConfig,
  FetcherRequestOpts,
  FetcherResponse,
} from '@/types'

export class Fetcher {
  readonly #config: FetcherConfig
  readonly #abortManager: FetcherAbortManager

  constructor(config: FetcherConfig) {
    this.#config = {
      ...DEFAULT_CONFIG,
      ...config,
    }

    this.#abortManager = new FetcherAbortManager()
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

  public async request<T = unknown>(
    cfg: FetcherRequestConfig,
  ): Promise<FetcherResponse<T>> {
    const req = buildRequest(this.#config, cfg, this.#abortManager)
    const result = new FetcherResponseBuilder<T>(req)

    // eslint-disable-next-line no-useless-catch
    try {
      // TODO: add interceptors
      const response = await fetch(req.url, req.config)
      result.populateResponse(response)
    } catch (e) {
      // TODO: handle error
      throw e
    }

    this.#abortManager.clear(cfg.id)
    return result.build()
  }

  public abort(requestId?: string): boolean {
    return this.#abortManager.abort(requestId)
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
}
