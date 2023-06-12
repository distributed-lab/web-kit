import type { FetcherResponse } from './fetcher'

export interface FetcherResponseBuilder<T> {
  build(): Promise<FetcherResponse<T>>
  populateResponse(response: Response): FetcherResponseBuilder<T>
}
