import { isEmptyBodyStatusCode } from '@/helpers'
import { FetcherRequest, FetcherResponse } from '@/types'

export class FetcherResponseBuilder<T> {
  #response?: Response
  readonly #result: FetcherResponse<T>

  constructor(request?: FetcherRequest, response?: Response) {
    this.#result = {
      ok: false,
      status: 0,
      statusText: '',
      headers: {} as Headers,
      url: '',
      request: request || { url: '' },
    }

    if (response) {
      this.populateResponse(response)
    }
  }

  public async build(): Promise<FetcherResponse<T>> {
    if (!this.#response || isEmptyBodyStatusCode(this.#response.status)) {
      return this.#result
    }

    await this.#extractData()

    return this.#result
  }

  public populateResponse(response: Response): this {
    this.#response = response.clone()
    this.#result.ok = response.ok
    this.#result.status = response.status
    this.#result.statusText = response.statusText
    this.#result.headers = response.headers
    this.#result.url = response.url
    return this
  }

  async #extractData() {
    if (!this.#response || !this.#response.ok) return
    if (isEmptyBodyStatusCode(this.#response.status)) return

    const parsers = [
      this.#tryToParseJson.bind(this),
      this.#tryToParseFormData.bind(this), // TODO: check if it's possible to parse formData
      this.#tryToParseBlob.bind(this),
    ]

    for (const parser of parsers) {
      const isParsed = await parser()
      if (isParsed) break
    }
  }

  async #tryToParseJson(): Promise<boolean> {
    // Clone response to be able to read response body multiple times
    // https://developer.mozilla.org/en-US/docs/Web/API/Response/bodyUsed
    return this.#tryToWrapper(this.#response?.clone()?.json() as Promise<T>)
  }

  async #tryToParseBlob(): Promise<boolean> {
    return this.#tryToWrapper(this.#response?.clone()?.blob() as Promise<T>)
  }

  async #tryToParseFormData(): Promise<boolean> {
    return this.#tryToWrapper(this.#response?.clone()?.formData() as Promise<T>)
  }

  async #tryToWrapper(promise: Promise<T>): Promise<boolean> {
    try {
      this.#result.data = (await promise) as T
      return true
    } catch (e) {
      return false
    }
  }
}
