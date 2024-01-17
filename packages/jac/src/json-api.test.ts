import { Fetcher, FetcherError } from '@distributedlab/fetcher'
import { RuntimeError } from '@distributedlab/tools'

import { errors } from '@/errors'
import type { JsonApiResponseErrors } from '@/types'

import { JsonApiClient } from './json-api'
import { MockWrapper, PARSED_RESPONSE, RAW_RESPONSE } from './tests'

const VALID_BASE_URL_1 = 'http://localhost'
const VALID_BASE_URL_2 = 'http://foo.bar'
const VALID_CFG = {
  baseUrl: VALID_BASE_URL_1,
}

const mockedBody = {
  foo: {
    bar: 'string',
  },
}

class CustomError extends RuntimeError {}

describe('performs JsonApiClient request unit test', () => {
  test('performs constructor, should set base url if provided', () => {
    const api = new JsonApiClient({ baseUrl: VALID_BASE_URL_1 })
    expect(api.baseUrl).toBe(VALID_BASE_URL_1)
  })

  describe('performs helper methods', () => {
    test('should throw exception "baseUrl" argument not provided', () => {
      const api = new JsonApiClient({ baseUrl: VALID_BASE_URL_1 })
      expect(() => api.useBaseUrl('')).toThrow(
        'Fetcher: invalid base URL. TypeError [ERR_INVALID_URL]: Invalid URL',
      )
    })

    test('should change base url', () => {
      const api = new JsonApiClient({ baseUrl: VALID_BASE_URL_1 })

      expect(api.baseUrl).toBe(VALID_BASE_URL_1)

      api.useBaseUrl(VALID_BASE_URL_2)

      expect(api.baseUrl).toBe(VALID_BASE_URL_2)
    })

    test('should throw exception if "baseUrl" argument not provided', () => {
      const api = new JsonApiClient({ baseUrl: VALID_BASE_URL_1 })
      expect(() => api.withBaseUrl('')).toThrow(
        'Fetcher: invalid base URL. TypeError [ERR_INVALID_URL]: Invalid URL',
      )
    })

    test('should return new client with new base url', () => {
      const api = new JsonApiClient({ baseUrl: VALID_BASE_URL_1 })
      const apiWithNewBaseUrl = api.withBaseUrl(VALID_BASE_URL_2)

      expect(api.baseUrl).toBe(VALID_BASE_URL_1)
      expect(apiWithNewBaseUrl).toBeInstanceOf(JsonApiClient)
      expect(apiWithNewBaseUrl.baseUrl).toBe(VALID_BASE_URL_2)
    })
  })

  describe('performs "request()"', () => {
    const rawResponse = MockWrapper.makeFetcherResponse(RAW_RESPONSE)

    let api: JsonApiClient

    beforeEach(() => {
      jest.resetModules()
      jest.clearAllMocks()
      api = new JsonApiClient(VALID_CFG)
      jest.spyOn(api, 'request')
      jest.spyOn(Fetcher.prototype, 'request').mockResolvedValue(rawResponse)
    })

    test('"get()" should call "request()" with correct params', async () => {
      const query = {
        page: {
          limit: 100,
        },
      }

      await api.get('/foo', { query })

      expect(api.request).toHaveBeenLastCalledWith({
        method: 'GET',
        endpoint: '/foo',
        query,
      })
    })

    test('"post()" should call "request()" with correct params', async () => {
      await api.post('/foo', { body: mockedBody })

      expect(api.request).toHaveBeenLastCalledWith({
        method: 'POST',
        endpoint: '/foo',
        body: mockedBody,
      })
    })

    test('"patch()" should call "request()" with correct params', async () => {
      await api.patch('/foo', { body: mockedBody })

      expect(api.request).toHaveBeenLastCalledWith({
        method: 'PATCH',
        endpoint: '/foo',
        body: mockedBody,
      })
    })

    test('"put()" should call "request()" with correct params', async () => {
      await api.put('/foo', { body: mockedBody })

      expect(api.request).toHaveBeenLastCalledWith({
        method: 'PUT',
        endpoint: '/foo',
        body: mockedBody,
      })
    })

    test('"delete()" should call "request()" with correct params', async () => {
      await api.delete('/foo')

      expect(api.request).toHaveBeenLastCalledWith({
        method: 'DELETE',
        endpoint: '/foo',
        body: undefined,
      })
    })
  })

  test('should throw network error', () => {
    const rawErrorResponse = MockWrapper.makeFetcherResponse(
      {
        errors: [
          {
            id: '1',
            code: 'err_some_code',
            status: '405',
            title: 'Unhandled error',
          },
        ],
      },
      405,
    )

    const api = new JsonApiClient(VALID_CFG)

    jest
      .spyOn(Fetcher.prototype, 'request')
      .mockRejectedValue(new FetcherError(rawErrorResponse))

    expect(api.get('')).rejects.toThrowError(errors.NetworkError)
  })

  test('should throw unauthorized error', () => {
    const rawErrorResponse = MockWrapper.makeFetcherResponse(
      {
        errors: [
          {
            id: '1',
            code: 'err_some_code',
            status: '401',
            title: 'Unauthorized',
          },
        ],
      },
      401,
    )

    const api = new JsonApiClient(VALID_CFG)

    jest
      .spyOn(Fetcher.prototype, 'request')
      .mockRejectedValue(new FetcherError(rawErrorResponse))

    expect(api.get('')).rejects.toThrowError(errors.UnauthorizedError)
  })

  test('should throw custom error', async () => {
    jest
      .spyOn(Fetcher.prototype, 'request')
      .mockRejectedValue(new CustomError(''))

    const api = new JsonApiClient(VALID_CFG)

    expect(api.get('/')).rejects.toThrowError(CustomError)
  })

  test('should return false if error is not instance of FetcherError', async () => {
    const error = new CustomError('')

    expect(error instanceof FetcherError<JsonApiResponseErrors>).toEqual(false)
  })

  test('should return correct data', () => {
    const rawResponse = MockWrapper.makeFetcherResponse(RAW_RESPONSE)
    jest.spyOn(Fetcher.prototype, 'request').mockResolvedValue(rawResponse)

    const api = new JsonApiClient(VALID_CFG)

    return api.get('').then(({ data }) => expect(data).toEqual(PARSED_RESPONSE))
  })
})
