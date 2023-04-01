import { FetcherInterceptorManager } from './interceptor-manager'
import { FetcherInterceptor, FetcherRequest, FetcherResponse } from './types'

describe('performs FetcherInterceptorManager unit test', () => {
  test('should add a new interceptor', () => {
    const manager = new FetcherInterceptorManager()
    const interceptor: FetcherInterceptor = {
      request: (config: FetcherRequest) => Promise.resolve(config),
    }
    manager.add(interceptor)
    expect(manager.interceptors.length).toBe(1)
    expect(manager.interceptors[0]).toBe(interceptor)
  })

  test('should eject an interceptor', () => {
    const manager = new FetcherInterceptorManager()
    const interceptor = {
      request: (config: FetcherRequest) => Promise.resolve(config),
    }
    manager.add(interceptor)
    manager.remove(interceptor)
    expect(manager.interceptors.length).toBe(0)
  })

  test('should not eject an interceptor if the interceptor is not found', () => {
    const manager = new FetcherInterceptorManager()
    const interceptor = {
      request: (config: FetcherRequest) => Promise.resolve(config),
    }
    manager.add(interceptor)
    manager.remove({
      request: (config: FetcherRequest) => Promise.resolve(config),
    })
    expect(manager.interceptors.length).toBe(1)
  })

  describe('performs request interceptors', () => {
    test('should run request interceptors', async () => {
      const manager = new FetcherInterceptorManager()
      const interceptor1 = {
        request: (config: FetcherRequest) => Promise.resolve(config),
      }
      const interceptor2 = {
        request: (config: FetcherRequest) => Promise.resolve(config),
      }
      manager.add(interceptor1)
      manager.add(interceptor2)
      const config = { url: 'http://localhost' }
      const result = await manager.runRequestInterceptors(config)
      expect(result).toBe(config)
    })

    test('should change request', async () => {
      const manager = new FetcherInterceptorManager()
      const interceptor1 = {
        request: (config: FetcherRequest) =>
          Promise.resolve({ ...config, url: 'http://localhost/1' }),
      }
      manager.add(interceptor1)
      const config = { url: 'http://localhost' }
      const result = await manager.runRequestInterceptors(config)
      expect(result).toStrictEqual({ url: 'http://localhost/1' })
    })
  })

  test('response interceptors should change response', async () => {
    type T = { foo: string }

    const response = {
      headers: {} as Headers,
      request: {
        url: '',
        method: 'GET',
      },
      url: '',
      data: { foo: 'bar' },
      ok: true,
      status: 200,
      statusText: 'OK',
    }

    const manager = new FetcherInterceptorManager()
    const interceptor = {
      response: (response: FetcherResponse<T>) =>
        Promise.resolve({ ...response, data: 'data1' }),
    }

    manager.add(interceptor)

    const result = await manager.runResponseInterceptors<T>(response)
    expect(result).toStrictEqual({ ...response, data: 'data1' })
  })

  test('error interceptors should change response on error', async () => {
    const response = {
      headers: {} as Headers,
      request: {
        url: '',
        method: 'GET',
      },
      url: '',
      data: { foo: 'bar' },
      ok: false,
      status: 400,
      statusText: 'Bad Request',
    }

    const manager = new FetcherInterceptorManager()
    const interceptor1 = {
      error: (response: FetcherResponse<object>) =>
        Promise.resolve({ ...response, data: 'data1' }),
    }
    manager.add(interceptor1)
    const result = await manager.runErrorInterceptors({
      ...response,
      data: 'data',
    })
    expect(result).toStrictEqual({ ...response, data: 'data1' })
  })
})
