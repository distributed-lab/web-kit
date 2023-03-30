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
      headers: new Headers(),
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
    this.#response = response
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
      this.#tryToParseText.bind(this),
      this.#tryToParseFormData.bind(this),
      this.#tryToParseBlob.bind(this),
    ]

    for (const parser of parsers) {
      const isParsed = await parser()
      if (isParsed) break
    }
  }

  async #tryToParseJson(): Promise<boolean> {
    return this.#tryToWrapper(this.#response?.json() as Promise<T>)
  }

  async #tryToParseText(): Promise<boolean> {
    return this.#tryToWrapper(this.#response?.text() as Promise<T>)
  }

  async #tryToParseBlob(): Promise<boolean> {
    return this.#tryToWrapper(this.#response?.blob() as Promise<T>)
  }

  async #tryToParseFormData(): Promise<boolean> {
    return this.#tryToWrapper(this.#response?.formData() as Promise<T>)
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
