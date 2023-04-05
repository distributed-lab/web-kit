import {
  FetcherRequest,
  FetcherRequestConfig,
  FetcherResponse,
} from '@distributedlab/fetcher'

import { JsonApiClient } from '../index'

export class MockWrapper {
  static makeFetcherResponse<T>(
    data: T,
    status = 200,
    request?: FetcherRequestConfig,
  ): FetcherResponse<T> {
    return {
      data,
      status,
      statusText: 'ok',
      headers: {} as HeadersInit,
      request: request || ({} as FetcherRequest),
    } as FetcherResponse<T>
  }

  static getMockedApi(): jest.Mocked<JsonApiClient> {
    return new JsonApiClient({
      baseUrl: 'http://localhost:8095/core',
    }) as never
  }
}
