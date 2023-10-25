import { EVENT_BUS_EVENTS } from '@/const'

export type EventBusEventMap<AdditionalEventBusMap extends object> =
  typeof EVENT_BUS_EVENTS & AdditionalEventBusMap

export type EventBusEventName<AdditionalEventBusMap extends object> = string &
  keyof EventBusEventMap<AdditionalEventBusMap>

export type EventBusEvent<
  AdditionalEventBusMap extends object,
  Payload = unknown,
> = {
  name: EventBusEventName<EventBusEventMap<AdditionalEventBusMap>>
  payload?: Payload
}

export type EventBusEventHandler<Payload> = (payload: Payload) => void

export type EventBusEventEmitterEventMap<AdditionalEventBusMap extends object> =
  {
    [key in keyof EventBusEventMap<AdditionalEventBusMap>]: unknown
  }
