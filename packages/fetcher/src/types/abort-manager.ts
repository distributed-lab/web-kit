export interface FetcherAbortManager {
  readonly controllers: Map<string, AbortController>

  get(requestId: string): AbortController | void
  set(requestId: string): AbortController
  setSafe(requestId?: string): AbortSignal | null
  has(requestId: string): boolean
  clear(requestId?: string): boolean
  abort(requestId?: string): boolean
}
