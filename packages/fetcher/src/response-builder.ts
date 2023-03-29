import { isEmptyBodyStatusCode } from '@/helpers'
import { FetcherResponse } from '@/types'

type ResponseParser<T> = () => Promise<T>

export class FetcherResponseBuilder<T> {
  #response?: Response
  readonly #result: FetcherResponse<T>

  constructor(
    request?: { url: string; config: RequestInit },
    response?: Response,
  ) {
    this.#result = {
      ok: false,
      status: 0,
      statusText: '',
      headers: new Headers(),
      url: '',
      request: request ? { url: request.url, ...request.config } : { url: '' },
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
    if (!this.#response) return
    if (isEmptyBodyStatusCode(this.#response.status)) return

    const parsers = [
      this.#tryToParseJson,
      this.#tryToParseText,
      this.#tryToParseBlob,
      this.#tryToParseFormData,
      this.#tryToParseArrayBuffer,
    ]

    for (const parser of parsers) {
      const isParsed = await parser()
      if (isParsed) break
    }
  }

  async #tryToParseJson(): Promise<boolean> {
    return this.#tryToWrapper(this.#response?.json as ResponseParser<T>)
  }

  async #tryToParseText(): Promise<boolean> {
    return this.#tryToWrapper(this.#response?.text as ResponseParser<T>)
  }

  async #tryToParseBlob(): Promise<boolean> {
    return this.#tryToWrapper(this.#response?.blob as ResponseParser<T>)
  }

  async #tryToParseFormData(): Promise<boolean> {
    return this.#tryToWrapper(this.#response?.formData as ResponseParser<T>)
  }

  async #tryToParseArrayBuffer(): Promise<boolean> {
    return this.#tryToWrapper(this.#response?.arrayBuffer as ResponseParser<T>)
  }

  async #tryToWrapper(handler: () => Promise<T>): Promise<boolean> {
    try {
      this.#result.data = (await handler()) as T
      return true
    } catch (e) {
      return false
    }
  }
}
