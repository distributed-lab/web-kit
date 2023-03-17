import Jsona from '@distributedlab/jsona'
import { AxiosResponse, RawAxiosResponseHeaders } from 'axios'
import isEmpty from 'lodash/isEmpty'

import { HTTP_METHODS, HTTP_STATUS_CODES } from '@/enums'
import { JsonApiClient } from '@/json-api'

import {
  Endpoint,
  JsonApiDefaultMeta,
  JsonApiLinkFields,
  JsonApiResponseLinks,
} from './types'

const formatter = new Jsona()

/**
 * API response wrapper.
 */
export class JsonApiResponse<T, U = JsonApiDefaultMeta> {
  private readonly _raw: AxiosResponse
  private readonly _rawData!: Record<string, unknown>
  private _data!: T
  private readonly _links: JsonApiResponseLinks
  private _apiClient: JsonApiClient
  private readonly _isNeedRaw: boolean
  private readonly _withCredentials: boolean
  private readonly _meta: U

  constructor(opts: {
    raw: AxiosResponse
    isNeedRaw: boolean
    apiClient: JsonApiClient
    withCredentials: boolean
  }) {
    this._raw = opts.raw
    this._rawData = opts.raw?.data
    this._links = opts.raw?.data?.links ?? {}
    this._apiClient = opts.apiClient
    this._isNeedRaw = opts.isNeedRaw
    this._withCredentials = opts.withCredentials
    this._parseResponse(opts.raw, opts.isNeedRaw)
    this._meta = opts.raw?.data?.meta || {}
  }

  get meta(): U {
    return this._meta
  }

  /**
   * Get raw response.
   */
  get rawResponse(): AxiosResponse {
    return this._raw
  }

  /**
   * Get request page limit.
   */
  get pageLimit(): number | undefined {
    const requestConfig = this._raw.config
    const pageLimitKey = 'page[limit]'

    if (!isEmpty(requestConfig.params)) {
      return requestConfig.params[pageLimitKey]
    }

    const decodedUrl = decodeURIComponent(requestConfig.url || '')
    const limit = new URLSearchParams(decodedUrl).get(pageLimitKey)

    return Number(limit)
  }

  /**
   * Get raw response data.
   */
  get rawData(): Record<string, unknown> {
    return this._rawData || {}
  }

  /**
   * Get response data.
   */
  get data(): T {
    return this._data
  }

  /**
   * Get response HTTP status.
   */
  get status(): number {
    return this._raw.status
  }

  /**
   * Get response headers.
   */
  get headers(): RawAxiosResponseHeaders {
    return this._raw.headers
  }

  /**
   * Get response links.
   */
  get links(): JsonApiResponseLinks {
    return this._links
  }

  /**
   * Is response links exist.
   */
  get isLinksExist(): boolean {
    return Boolean(this._links) && !isEmpty(this._links)
  }

  /**
   * Parses and unwraps response data.
   */
  private _parseResponse(raw: AxiosResponse, isNeedRaw: boolean) {
    if (
      raw.status === HTTP_STATUS_CODES.NO_CONTENT ||
      raw.status === HTTP_STATUS_CODES.RESET_CONTENT
    ) {
      return
    }

    this._data = isNeedRaw
      ? (raw.data as T)
      : (formatter.deserialize(raw.data) as T)
  }

  private _createLink(link: Endpoint): Endpoint {
    const baseUrl = this._apiClient?.baseUrl

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

    const link = this._createLink(this.links[page] as string)

    const JsonApiClientRequestOpts = {
      endpoint: link,
      method: this._raw.config.method?.toUpperCase() as HTTP_METHODS,
      headers: this._raw.config.headers,
      isNeedRaw: this._isNeedRaw,
      withCredentials: this._withCredentials,
    }

    return this._apiClient.request<T, U>(JsonApiClientRequestOpts)
  }
}
