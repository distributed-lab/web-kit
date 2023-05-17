import type {
  FetcherInterceptor,
  FetcherRequest,
  FetcherResponse,
} from '@/types'

export class FetcherInterceptorManager {
  #interceptors: FetcherInterceptor[] = []

  constructor(interceptors?: FetcherInterceptor[]) {
    if (interceptors) {
      this.#interceptors = [...interceptors]
    }
  }

  public get interceptors(): FetcherInterceptor[] {
    return this.#interceptors
  }

  public add(interceptor: FetcherInterceptor): void {
    this.#interceptors.push(interceptor)
  }

  public remove(interceptor: FetcherInterceptor): void {
    const index = this.#interceptors.indexOf(interceptor)
    if (!~index) return
    this.#interceptors.splice(index, 1)
  }

  public clear(): void {
    this.#interceptors = []
  }

  public async runRequestInterceptors(
    request: FetcherRequest,
  ): Promise<FetcherRequest> {
    let req = request

    for (const interceptor of this.#interceptors) {
      if (interceptor.request) {
        req = await interceptor.request(req)
      }
    }

    return req
  }

  // @distributedlab/web-kit
  //
  public async runResponseInterceptors<T>(
    response: FetcherResponse<T>,
  ): Promise<FetcherResponse<T>> {
    return this.#runResponseInterceptors(response, 'response')
  }

  public async runErrorInterceptors<T>(
    response: FetcherResponse<T>,
  ): Promise<FetcherResponse<T>> {
    return this.#runResponseInterceptors(response, 'error')
  }

  async #runResponseInterceptors<T>(
    response: FetcherResponse<T>,
    fnName: 'response' | 'error',
  ): Promise<FetcherResponse<T>> {
    let resp = response

    for (const interceptor of this.#interceptors) {
      try {
        const fn = interceptor[fnName]
        if (fn) resp = (await fn(resp)) as FetcherResponse<T>
      } catch (error) {
        console.warn(error)
      }
    }

    return resp
  }
}
