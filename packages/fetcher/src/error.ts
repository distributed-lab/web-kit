import { RuntimeError } from '@distributedlab/tools'

import type { FetcherRequest, FetcherResponse } from '@/types'

export class FetcherError<T = undefined> extends Error {
  public name = 'FetcherError'
  public response: FetcherResponse<T>
  public request: FetcherRequest

  constructor(resp: FetcherResponse<T>) {
    super(resp.statusText)
    this.response = resp
    this.request = resp.request
  }
}

export class FetcherURLParseError extends RuntimeError {
  public name = 'FetcherURLParseError'

  constructor(e = new TypeError('Failed to parse URL')) {
    super(e)
  }
}
