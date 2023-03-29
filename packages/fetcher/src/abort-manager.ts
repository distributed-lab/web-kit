export class FetcherAbortManager {
  readonly #controllers: Map<string, AbortController>

  constructor() {
    this.#controllers = new Map()
  }

  public get(requestId: string): AbortController | undefined {
    return this.#controllers.get(requestId)
  }

  public set(requestId: string): AbortController {
    const controller = new AbortController()
    this.#controllers.set(requestId, controller)
    return controller
  }

  public setSafe(requestId?: string): AbortSignal | null {
    if (!requestId) return null
    return this.set(requestId).signal
  }

  public has(requestId: string): boolean {
    return this.#controllers.has(requestId)
  }

  public clear(requestId?: string): boolean {
    return this.#controllers.delete(requestId ?? '')
  }

  public abort(requestId?: string): boolean {
    const id = requestId ?? ''

    if (!id || !this.has(id)) return false

    const controller = this.get(id)!
    controller.abort()
    return this.clear(id)
  }
}
