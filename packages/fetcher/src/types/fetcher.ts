import { HTTP_METHODS } from '@/enums'

export type FetcherConfig = {
  baseUrl: string
  credentials?: RequestCredentials
  cache?: RequestCache
  headers?: HeadersInit
  mode?: RequestMode
  referrer?: string
  referrerPolicy?: ReferrerPolicy
}

export type FetcherRequestOpts = {
  headers?: HeadersInit
  id?: string
}

export type FetcherRequestQuery = Record<string, string | number | boolean>

export type FetcherRequestConfig = FetcherRequestOpts & {
  endpoint: string
  method: HTTP_METHODS
  query?: FetcherRequestQuery
}

export type FetcherResponse<T> = {
  ok: boolean
  status: number
  statusText: string
  headers: Headers
  url: string
  request: RequestInit & { url: string }
  data?: T
}
