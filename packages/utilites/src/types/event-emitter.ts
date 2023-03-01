export type EventMap = Record<string, unknown>

export type EventMapKey<T extends EventMap> = string & keyof T

export type EventHandler<T> = (params: T) => void

export type EventHandlers<T extends EventMap, K extends keyof T> = Array<
  (p: T[K]) => void
>

export type EventHandlersMap<T extends EventMap> = {
  [K in keyof T]?: EventHandlers<T, K>
}
