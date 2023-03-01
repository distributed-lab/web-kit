import axios from 'axios'
import { RAW_RESPONSE, PARSED_RESPONSE } from './test'
import { JsonApiClient } from './json-api'
import { MockWrapper } from './test'

jest.mock('axios')

const mockedAxios = axios as jest.MockedFunction<typeof axios>

const mockedData = {
  foo: {
    bar: 'string',
  },
}

beforeEach(() => {
  jest.resetModules()
  jest.clearAllMocks()
})

describe('performs JsonApiClient request unit test', () => {
  describe('performs constructor', () => {
    test('should set base url if provided', () => {
      const api = new JsonApiClient({ baseUrl: 'foo' })
      expect(api.baseUrl).toBe('foo')
    })

    test('should set base url and auth token if provided', () => {
      const api = new JsonApiClient({ baseUrl: 'foo' })
      expect(api.baseUrl).toBe('foo')
    })

    test('base url and auth token should be empty if not provided', () => {
      const api = new JsonApiClient()
      expect(api.baseUrl).toBe('')
    })
  })

  describe('performs helper methods', () => {
    test('should throw exception "baseUrl" argument not provided', () =>
      expect(() => new JsonApiClient().useBaseUrl('')).toThrow(
        'Arg "baseUrl" not passed',
      ))

    test('should change base url', () => {
      const api = new JsonApiClient({ baseUrl: 'foo' })

      expect(api.baseUrl).toBe('foo')

      api.useBaseUrl('bar')

      expect(api.baseUrl).toBe('bar')
    })

    test('should throw exception if "baseUrl" argument not provided', () =>
      expect(() => new JsonApiClient().withBaseUrl('')).toThrow(
        'Arg "baseUrl" not passed',
      ))

    test('should return new client with new base url', () => {
      const api = new JsonApiClient({ baseUrl: 'foo' })
      const apiWithNewBaseUrl = api.withBaseUrl('bar')

      expect(api.baseUrl).toBe('foo')
      expect(apiWithNewBaseUrl).toBeInstanceOf(JsonApiClient)
      expect(apiWithNewBaseUrl.baseUrl).toBe('bar')
    })
  })

  describe('performs "request()"', () => {
    const rawResponse = MockWrapper.makeAxiosResponse(RAW_RESPONSE)

    let api: JsonApiClient

    beforeEach(() => {
      mockedAxios.mockResolvedValue(rawResponse)

      api = new JsonApiClient({
        baseUrl: 'http://localhost:8095',
        axios: mockedAxios,
      })

      jest.spyOn(api, 'request')
    })

    test('"get()" should call "request()" with correct params', async () => {
      const query = {
        page: {
          limit: 100,
        },
      }

      await api.get('/foo', query)

      expect(api.request).toHaveBeenLastCalledWith({
        method: 'GET',
        endpoint: '/foo',
        query,
        isEmptyBodyAllowed: true,
      })
    })

    test('"post()" should call "request()" with correct params', async () => {
      await api.post('/foo', mockedData)

      expect(api.request).toHaveBeenLastCalledWith({
        method: 'POST',
        endpoint: '/foo',
        data: mockedData,
      })
    })

    test('"patch()" should call "request()" with correct params', async () => {
      await api.patch('/foo', mockedData)

      expect(api.request).toHaveBeenLastCalledWith({
        method: 'PATCH',
        endpoint: '/foo',
        data: mockedData,
      })
    })

    test('"put()" should call "request()" with correct params', async () => {
      await api.put('/foo', mockedData)

      expect(api.request).toHaveBeenLastCalledWith({
        method: 'PUT',
        endpoint: '/foo',
        data: mockedData,
      })
    })

    test('"delete()" should call "request()" with correct params', async () => {
      await api.delete('/foo')

      expect(api.request).toHaveBeenLastCalledWith({
        method: 'DELETE',
        endpoint: '/foo',
        data: undefined,
        isEmptyBodyAllowed: true,
      })
    })
  })

  test('should return correct data', () => {
    const rawResponse = MockWrapper.makeAxiosResponse(RAW_RESPONSE)
    mockedAxios.mockResolvedValueOnce(rawResponse)

    const api = new JsonApiClient({
      baseUrl: 'http://localhost:8095',
      axios: mockedAxios,
    })

    return api.get('').then(({ data }) => expect(data).toEqual(PARSED_RESPONSE))
  })
})
