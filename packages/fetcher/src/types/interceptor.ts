import { FetcherRequest, FetcherResponse } from './fetcher'

export type FetcherRequestInterceptor = (
  config: FetcherRequest,
) => Promise<FetcherRequest>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FetcherResponseInterceptor<T = any> = (
  response: FetcherResponse<T>,
) => Promise<FetcherResponse<T>>

export type FetcherErrorResponseInterceptor = FetcherResponseInterceptor

export type FetcherInterceptor = {
  request?: FetcherRequestInterceptor
  response?: FetcherResponseInterceptor
  error?: FetcherErrorResponseInterceptor
}
