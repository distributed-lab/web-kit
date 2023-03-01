import { EventMapKey, EventMap, EventHandler, EventHandlersMap } from '@/types'

export class EventEmitter<T extends EventMap> {
  #handlers: EventHandlersMap<T> = {}

  get handlers(): EventHandlersMap<T> {
    return this.#handlers
  }

  public on<K extends EventMapKey<T>>(key: K, fn: EventHandler<T[K]>): void {
    this.#handlers[key] = (this.#handlers[key] || [])?.concat(fn)
  }

  public once<K extends EventMapKey<T>>(key: K, fn: EventHandler<T[K]>): void {
    const handler = (data: T[K]) => {
      fn(data)
      this.off(key, handler)
    }
    this.on(key, handler)
  }

  public off<K extends EventMapKey<T>>(key: K, fn: EventHandler<T[K]>): void {
    this.#handlers[key] = (this.#handlers[key] || [])?.filter(f => f !== fn)
  }

  public emit<K extends EventMapKey<T>>(key: K, data: T[K]): void | never {
    ;(this.#handlers[key] || [])?.forEach((fn: EventHandler<T[K]>) => {
      fn(data)
    })
  }

  public clear(): void {
    this.#handlers = {}
  }
}
