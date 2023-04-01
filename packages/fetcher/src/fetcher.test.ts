import { FetcherAbortManager } from './abort-manager'
import { DEFAULT_CONFIG } from './const'
import { Fetcher } from './fetcher'
import { FetcherInterceptorManager } from './interceptor-manager'
import { mockFetchResponse } from './tests'
import { FetcherRequest } from './types'

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
      const fetcher = new Fetcher(cfg)
      expect(fetcher.config).toEqual({
        ...DEFAULT_CONFIG,
        ...cfg,
      })
    })

    test('should create abort manager', () => {
      const fetcher = new Fetcher(cfg)
      expect(fetcher.abortManager).toBeInstanceOf(FetcherAbortManager)
    })

    test('should create interceptor manager', () => {
      const fetcher = new Fetcher(cfg)
      expect(fetcher.interceptorManager).toBeInstanceOf(
        FetcherInterceptorManager,
      )
    })

    test('should create interceptor manager with interceptors', () => {
      const interceptor = {
        request: (cfg: FetcherRequest) => Promise.resolve(cfg),
      }

      const fetcher = new Fetcher(cfg, [interceptor])

      expect(fetcher.interceptorManager.interceptors.length).toBe(1)
      expect(fetcher.interceptorManager.interceptors[0]).toBe(interceptor)
    })
  })

  describe('performs helper methods', () => {
    test('should return base url', () => {
      const fetcher = new Fetcher(cfg)
      expect(fetcher.baseUrl).toBe(cfg.baseUrl)
    })

    test('should use interceptor', () => {
      const fetcher = new Fetcher(cfg)
      const interceptor = {
        request: (cfg: FetcherRequest) => Promise.resolve(cfg),
      }
      fetcher.useInterceptor(interceptor)
      expect(fetcher.interceptorManager.interceptors.length).toBe(1)
      expect(fetcher.interceptorManager.interceptors[0]).toBe(interceptor)
    })

    test('should eject interceptor', () => {
      const fetcher = new Fetcher(cfg)
      const interceptor = {
        request: (cfg: FetcherRequest) => Promise.resolve(cfg),
      }
      fetcher.useInterceptor(interceptor)
      fetcher.ejectInterceptor(interceptor)
      expect(fetcher.interceptorManager.interceptors.length).toBe(0)
    })

    test('should use base url', () => {
      const fetcher = new Fetcher(cfg)
      const newBaseUrl = 'http://localhost:8080/'
      fetcher.useBaseUrl(newBaseUrl)
      expect(fetcher.baseUrl).toBe(newBaseUrl)
    })

    test('should update config', () => {
      const fetcher = new Fetcher(cfg)
      const newConfig = { timeout: 1000 }
      fetcher.updateConfig(newConfig)
      expect(fetcher.config).toEqual({
        ...DEFAULT_CONFIG,
        ...cfg,
        ...newConfig,
      })
    })

    test('should abort request', () => {
      const fetcher = new Fetcher(cfg)
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
      fetcher = new Fetcher(cfg)

      mockFetchResponse(mockedEmptyResponse)

      jest.spyOn(fetcher, 'request')
    })

    test('"get()" should call "request()" with correct params', async () => {
      const query = { foo: 'bar' }

      await fetcher.get('/get', query)

      expect(fetcher.request).toHaveBeenLastCalledWith({
        method: 'GET',
        endpoint: '/get',
        query,
      })
    })

    test('"post()" should call "request()" with correct params', async () => {
      await fetcher.post('/post', mockedBody)

      expect(fetcher.request).toHaveBeenLastCalledWith({
        method: 'POST',
        endpoint: '/post',
        body: mockedBody,
      })
    })

    test('"put()" should call "request()" with correct params', async () => {
      await fetcher.put('/put', mockedBody)

      expect(fetcher.request).toHaveBeenLastCalledWith({
        method: 'PUT',
        endpoint: '/put',
        body: mockedBody,
      })
    })

    test('"patch()" should call "request()" with correct params', async () => {
      await fetcher.patch('/patch', mockedBody)

      expect(fetcher.request).toHaveBeenLastCalledWith({
        method: 'PATCH',
        endpoint: '/patch',
        body: mockedBody,
      })
    })

    test('"delete()" should call "request()" with correct params', async () => {
      await fetcher.delete('/delete')

      expect(fetcher.request).toHaveBeenLastCalledWith({
        method: 'DELETE',
        endpoint: '/delete',
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
