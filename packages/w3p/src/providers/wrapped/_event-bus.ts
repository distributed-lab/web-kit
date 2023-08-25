import { EventEmitter } from '@distributedlab/tools'

import { PROVIDER_EVENT_BUS_EVENTS } from '@/enums'
import type { ProviderEventMap, ProviderEventPayload } from '@/types'

export class ProviderEventBus {
  readonly #emitter = new EventEmitter<ProviderEventMap>()

  public get emitter(): EventEmitter<ProviderEventMap> {
    return this.#emitter
  }

  public emit(
    event: PROVIDER_EVENT_BUS_EVENTS,
    payload: ProviderEventPayload,
  ): void {
    this.#emitter.emit(event, payload)
  }

  public onBeforeTxSent(cb: (e?: ProviderEventPayload) => void): void {
    this.#emitter.on(PROVIDER_EVENT_BUS_EVENTS.BeforeTxSent, cb)
  }

  public onTxSent(cb: (e?: ProviderEventPayload) => void): void {
    this.#emitter.on(PROVIDER_EVENT_BUS_EVENTS.TxSent, cb)
  }

  public onTxConfirmed(cb: (e?: ProviderEventPayload) => void): void {
    this.#emitter.on(PROVIDER_EVENT_BUS_EVENTS.TxConfirmed, cb)
  }

  public onInitiated(cb: (e?: ProviderEventPayload) => void): void {
    this.#emitter.once(PROVIDER_EVENT_BUS_EVENTS.Initiated, cb)
  }

  public onConnect(cb: (e?: ProviderEventPayload) => void): void {
    this.#emitter.on(PROVIDER_EVENT_BUS_EVENTS.Connect, cb)
  }

  public onDisconnect(cb: (e?: ProviderEventPayload) => void): void {
    this.#emitter.on(PROVIDER_EVENT_BUS_EVENTS.Disconnect, cb)
  }

  public onAccountChanged(cb: (e?: ProviderEventPayload) => void): void {
    this.#emitter.on(PROVIDER_EVENT_BUS_EVENTS.AccountChanged, cb)
  }

  public onChainChanged(cb: (e?: ProviderEventPayload) => void): void {
    this.#emitter.on(PROVIDER_EVENT_BUS_EVENTS.ChainChanged, cb)
  }

  // TODO: RETURN
  public onUriUpdate(cb: (e?: ProviderEventPayload) => void): void {
    this.#emitter.on(PROVIDER_EVENT_BUS_EVENTS.UriUpdate, cb)
  }

  public clearHandlers(): void {
    this.#emitter.clear()
  }
}
