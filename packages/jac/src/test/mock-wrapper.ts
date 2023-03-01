import { AxiosRequestConfig, AxiosResponse, AxiosResponseHeaders } from 'axios'
import { JsonApiClient } from '../index'

export class MockWrapper {
  static makeAxiosResponse<T>(
    data: T,
    status = 200,
    config?: AxiosRequestConfig,
  ): AxiosResponse<T> {
    return {
      data,
      status,
      statusText: 'ok',
      headers: {} as AxiosResponseHeaders,
      config: config || ({} as AxiosRequestConfig),
    } as AxiosResponse
  }

  static getMockedApi(): jest.Mocked<JsonApiClient> {
    return new JsonApiClient({
      baseUrl: 'http://localhost:8095/core',
    }) as never
  }
}
