import log from 'loglevel'

import { EVENT_BUS_EVENTS } from '@/const'
import type {
  EventBusEvent,
  EventBusEventEmitterEventMap,
  EventBusEventHandler,
  EventBusEventMap,
  EventBusEventName,
  EventHandler,
} from '@/types'

import { EventEmitter } from './event-emitter'

export class EventBus<AdditionalEventBusMap extends object = object> {
  readonly #events: EventBusEventMap<AdditionalEventBusMap>
  readonly #emitter: EventEmitter<
    EventBusEventEmitterEventMap<AdditionalEventBusMap>
  >
  #backlog: EventBusEvent<EventBusEventMap<AdditionalEventBusMap>>[]

  constructor(events?: AdditionalEventBusMap) {
    this.#backlog = []
    this.#emitter = new EventEmitter<
      EventBusEventEmitterEventMap<AdditionalEventBusMap>
    >()

    this.#events = {
      ...EVENT_BUS_EVENTS,
      ...(events || {}),
    } as EventBusEventMap<AdditionalEventBusMap>
  }

  public get events(): EventBusEventMap<AdditionalEventBusMap> {
    return this.#events
  }

  public isEventExists(
    event: EventBusEventName<AdditionalEventBusMap>,
  ): boolean {
    const values = Object.values(
      this.#events,
    ) as EventBusEventName<AdditionalEventBusMap>[]
    return values.includes(event)
  }

  public on<Payload>(
    event: EventBusEventName<EventBusEventMap<AdditionalEventBusMap>>,
    handler: EventBusEventHandler<Payload>,
  ): void {
    if (!this.isEventExists(event)) {
      throw new Error(`EventBus.list has no ${event} event`)
    }

    const backloggedEvents = this.#backlog.filter(e => e.name === event)

    for (const [index, eventObj] of backloggedEvents.entries()) {
      handler(eventObj.payload as Payload)
      this.#backlog.splice(index, 1)
      log.debug(`Event ${event} is backlogged. Handling...`)
    }
    this.#emitter.on(event, handler as EventHandler<unknown>)
  }

  public emit<Payload>(
    event: EventBusEventName<EventBusEventMap<AdditionalEventBusMap>>,
    payload?: Payload,
  ): void {
    if (!this.isEventExists(event)) {
      throw new Error(`EventBus.list has no ${event.toString()} event`)
    }

    this.#emitter.emit(event, payload)
  }

  public reset<Payload>(
    event: EventBusEventName<EventBusEventMap<AdditionalEventBusMap>>,
    handler: EventBusEventHandler<Payload>,
  ): void {
    if (!this.isEventExists(event)) {
      throw new Error(`EventBus.list has no ${event.toString()} event`)
    }
    this.#emitter.off(event, handler as EventHandler<unknown>)
    this.#backlog = []
  }

  public success<Payload>(payload: Payload): void {
    this.#emitter.emit(this.#events.success, payload)
  }

  public warning<Payload>(payload: Payload): void {
    this.#emitter.emit(this.#events.warning, payload)
  }

  public error<Payload>(payload: Payload): void {
    this.#emitter.emit(this.#events.error, payload)
  }

  public info<Payload>(payload: Payload): void {
    this.#emitter.emit(this.#events.info, payload)
  }
}
