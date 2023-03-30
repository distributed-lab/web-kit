import { FetcherRequest, FetcherResponse } from './fetcher'

export type FetcherRequestInterceptor = (
  config: FetcherRequest,
) => Promise<FetcherRequest>

export type FetcherResponseInterceptor = (
  response: FetcherResponse<unknown>,
) => Promise<FetcherResponse<unknown>>

export type FetcherErrorResponseInterceptor = FetcherResponseInterceptor

export type FetcherInterceptor = {
  request?: FetcherRequestInterceptor
  response?: FetcherResponseInterceptor
  error?: FetcherErrorResponseInterceptor
}
