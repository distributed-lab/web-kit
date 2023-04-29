import type { HTTP_METHODS } from '@/enums'

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
  | FetcherRequestQueryValue
  | FetcherRequestQueryValue[]
  | Record<string, FetcherRequestQueryValue | FetcherRequestQueryValue[]>
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
