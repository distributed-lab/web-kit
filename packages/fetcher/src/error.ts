import { FetcherRequest, FetcherResponse } from '@/types'

export class FetcherError extends Error {
  public name = 'FetcherError'
  public response: FetcherResponse<undefined>
  public request: FetcherRequest

  constructor(resp: FetcherResponse<undefined>) {
    super(resp.statusText)
    this.response = resp
    this.request = resp.request
  }
}
