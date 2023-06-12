import { DEFAULT_CONFIG } from './const'
import { newFetcher } from './fetcher'
import { mockFetchResponse } from './tests'
import type { Fetcher, FetcherRequest } from './types'

beforeEach(() => {
  jest.resetModules()
  jest.clearAllMocks()
})

const cfg = {
  baseUrl: 'https://example.com/',
}

describe('performs Fetcher unit test', () => {
  describe('performs constructor', () => {
    test('should set config', () => {
      const fetcher = newFetcher(cfg)
      expect(fetcher.config).toEqual({
        ...DEFAULT_CONFIG,
        ...cfg,
      })
    })

    test('should create interceptor manager with interceptors', () => {
      const interceptor = {
        request: (cfg: FetcherRequest) => Promise.resolve(cfg),
      }

      const fetcher = newFetcher(cfg, [interceptor])

      expect(fetcher.interceptorManager.interceptors.length).toBe(1)
      expect(fetcher.interceptorManager.interceptors[0]).toBe(interceptor)
    })
  })

  describe('performs helper methods', () => {
    test('should return base url', () => {
      const fetcher = newFetcher(cfg)
      expect(fetcher.baseUrl).toBe(cfg.baseUrl)
    })

    test('should use interceptor', () => {
      const fetcher = newFetcher(cfg)
      const interceptor = {
        request: (cfg: FetcherRequest) => Promise.resolve(cfg),
      }
      fetcher.addInterceptor(interceptor)
      expect(fetcher.interceptorManager.interceptors.length).toBe(1)
      expect(fetcher.interceptorManager.interceptors[0]).toBe(interceptor)
    })

    test('should eject interceptor', () => {
      const fetcher = newFetcher(cfg)
      const interceptor = {
        request: (cfg: FetcherRequest) => Promise.resolve(cfg),
      }
      fetcher.addInterceptor(interceptor)
      fetcher.removeInterceptor(interceptor)
      expect(fetcher.interceptorManager.interceptors.length).toBe(0)
    })

    test('should use base url', () => {
      const fetcher = newFetcher(cfg)
      const newBaseUrl = 'http://localhost:8080/'
      fetcher.useBaseUrl(newBaseUrl)
      expect(fetcher.baseUrl).toBe(newBaseUrl)
    })

    test('should update config', () => {
      const fetcher = newFetcher(cfg)
      const newConfig = { timeout: 1000 }
      fetcher.updateConfig(newConfig)
      expect(fetcher.config).toEqual({
        ...DEFAULT_CONFIG,
        ...cfg,
        ...newConfig,
      })
    })

    test('should abort request', () => {
      const fetcher = newFetcher(cfg)
      const abortSpy = jest.spyOn(fetcher.abortManager, 'abort')
      fetcher.abort()
      expect(abortSpy).toBeCalled()
    })
  })

  describe('performs request methods', () => {
    let fetcher: Fetcher

    const mockedEmptyResponse = {
      ok: true,
      clone: () => ({
        status: 200,
        ok: true,
        clone: () => ({
          json: () => Promise.resolve({}),
        }),
      }),
    }

    const mockedBody = {
      foo: 'bar',
    }

    beforeEach(() => {
      fetcher = newFetcher(cfg)

      mockFetchResponse(mockedEmptyResponse)

      jest.spyOn(fetcher, 'request')
    })

    test('"get()" should call "request()" with correct params', async () => {
      const query = { foo: 'bar' }

      await fetcher.get('/get', { query })

      expect(fetch).toHaveBeenLastCalledWith(
        'https://example.com/get?foo=bar',
        {
          body: null,
          cache: 'no-store',
          credentials: 'include',
          headers: {},
          method: 'GET',
          signal: expect.any(AbortSignal),
          referrerPolicy: 'strict-origin-when-cross-origin',
          url: 'https://example.com/get?foo=bar',
        },
      )
    })

    test('"post()" should call "request()" with correct params', async () => {
      await fetcher.post('/post', { body: mockedBody })

      const url = 'https://example.com/post'

      expect(fetch).toHaveBeenLastCalledWith(url, {
        body: JSON.stringify(mockedBody),
        cache: 'no-store',
        credentials: 'include',
        headers: {},
        method: 'POST',
        signal: expect.any(AbortSignal),
        referrerPolicy: 'strict-origin-when-cross-origin',
        url,
      })
    })

    test('"put()" should call "request()" with correct params', async () => {
      await fetcher.put('/put', { body: mockedBody })

      const url = 'https://example.com/put'

      expect(fetch).toHaveBeenLastCalledWith(url, {
        body: JSON.stringify(mockedBody),
        cache: 'no-store',
        credentials: 'include',
        headers: {},
        method: 'PUT',
        signal: expect.any(AbortSignal),
        referrerPolicy: 'strict-origin-when-cross-origin',
        url,
      })
    })

    test('"patch()" should call "request()" with correct params', async () => {
      await fetcher.patch('/patch', { body: mockedBody })

      const url = 'https://example.com/patch'

      expect(fetch).toHaveBeenLastCalledWith(url, {
        body: JSON.stringify(mockedBody),
        cache: 'no-store',
        credentials: 'include',
        headers: {},
        method: 'PATCH',
        signal: expect.any(AbortSignal),
        referrerPolicy: 'strict-origin-when-cross-origin',
        url,
      })
    })

    test('"delete()" should call "request()" with correct params', async () => {
      await fetcher.delete('/delete')

      const url = 'https://example.com/delete'

      expect(fetch).toHaveBeenLastCalledWith(url, {
        body: null,
        cache: 'no-store',
        credentials: 'include',
        headers: {},
        method: 'DELETE',
        signal: expect.any(AbortSignal),
        referrerPolicy: 'strict-origin-when-cross-origin',
        url,
      })
    })

    test('should return correct object response', async () => {
      const mockedResponse = {
        ok: true,
        clone: () => ({
          status: 200,
          ok: true,
          clone: () => ({
            json: () => Promise.resolve(mockedBody),
          }),
        }),
      }

      mockFetchResponse(mockedResponse)

      const response = await fetcher.get('/get')

      expect(response.data).toEqual(mockedBody)
    })

    test('should return correct Blob response', async () => {
      const mockedResponse = {
        ok: true,
        clone: () => ({
          status: 200,
          ok: true,
          clone: () => ({
            json: () => Promise.reject(),
            formData: () => Promise.reject(),
            blob: () => Promise.resolve(new Blob()),
          }),
        }),
      }

      const blob = new Blob()

      mockFetchResponse(mockedResponse)

      const response = await fetcher.get('/get')

      expect(response.data).toEqual(blob)
    })
  })
})
