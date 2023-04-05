import { HTTP_METHODS, HTTP_STATUS_CODES } from '@distributedlab/fetcher'
import Jsona from '@distributedlab/jsona'
import isEmpty from 'lodash/isEmpty'

import { JsonApiClient } from '@/json-api'

import {
  Endpoint,
  JsonApiClientRequestConfigHeaders,
  JsonApiDefaultMeta,
  JsonApiLinkFields,
  JsonApiResponseLinks,
  JsonApiResponseRaw,
  JsonApiResponseRawData,
} from './types'

const formatter = new Jsona()

const PAGE_LIMIT_KEY = 'page[limit]'

/**
 * JSON API response wrapper.
 */
export class JsonApiResponse<T, U = JsonApiDefaultMeta> {
  readonly #raw: JsonApiResponseRaw
  readonly #rawData?: JsonApiResponseRawData
  readonly #links: JsonApiResponseLinks
  readonly #isNeedRaw: boolean
  readonly #meta: U
  #data: T
  #apiClient: JsonApiClient

  constructor(opts: {
    raw: JsonApiResponseRaw
    isNeedRaw: boolean
    apiClient: JsonApiClient
  }) {
    const response = opts.raw
    const data = response.data
    this.#raw = response
    this.#data = {} as T
    this.#rawData = data || {}
    this.#links = data?.links ?? {}
    this.#apiClient = opts.apiClient
    this.#isNeedRaw = opts.isNeedRaw

    this.#parseResponse(opts.raw, opts.isNeedRaw)
    this.#meta = (data?.meta || {}) as U
  }

  get meta(): U {
    return this.#meta
  }

  /**
   * Get raw response.
   */
  get rawResponse(): JsonApiResponseRaw {
    return this.#raw
  }

  /**
   * Get request page limit.
   */
  get pageLimit(): number | undefined {
    const requestConfig = this.#raw.request
    const decodedUrl = decodeURIComponent(requestConfig.url || '')
    const limit = new URLSearchParams(decodedUrl).get(PAGE_LIMIT_KEY)
    return Number(limit)
  }

  /**
   * Get raw response data.
   */
  get rawData(): JsonApiResponseRawData {
    return this.#rawData || {}
  }

  /**
   * Get response data.
   */
  get data(): T {
    return this.#data
  }

  /**
   * Get response HTTP status.
   */
  get status(): HTTP_STATUS_CODES {
    return this.#raw.status
  }

  /**
   * Get response headers.
   */
  get headers(): JsonApiClientRequestConfigHeaders {
    return this.#raw.headers
  }

  /**
   * Get response links.
   */
  get links(): JsonApiResponseLinks {
    return this.#links
  }

  /**
   * Is response links exist.
   */
  get isLinksExist(): boolean {
    return Boolean(this.#links) && !isEmpty(this.#links)
  }

  /**
   * Parses and unwraps response data.
   */
  #parseResponse(raw: JsonApiResponseRaw, isNeedRaw: boolean) {
    if (!raw.data) return

    this.#data = isNeedRaw
      ? (raw.data as T)
      : (formatter.deserialize(raw.data) as T)
  }

  #createLink(link: Endpoint): Endpoint {
    const baseUrl = this.#apiClient?.baseUrl

    if (!baseUrl) return link

    let intersection = ''

    for (const char of link) {
      if (baseUrl.endsWith(intersection + char)) {
        intersection += char
        break
      } else {
        intersection += char
      }
    }

    return link.replace(intersection, '')
  }

  public async fetchPage(
    page: JsonApiLinkFields,
  ): Promise<JsonApiResponse<T, U>> {
    if (!this.isLinksExist) {
      throw new TypeError('There are no links in response')
    }

    const link = this.#createLink(this.links[page] as string)

    const jsonApiClientRequestOpts = {
      endpoint: link,
      method: this.#raw.request.method as HTTP_METHODS,
      headers: this.#raw.request.headers,
      isNeedRaw: this.#isNeedRaw,
    }

    return this.#apiClient.request<T, U>(jsonApiClientRequestOpts)
  }
}
