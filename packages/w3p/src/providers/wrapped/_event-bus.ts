import { EventEmitter } from '@distributedlab/tools'

import { PROVIDER_EVENT_BUS_EVENTS } from '@/enums'
import {
  ProviderAfterTxConfirmedEventPayload,
  ProviderAfterTxSentEventPayload,
  ProviderBeforeTxSentEventPayload,
  ProviderChainChangedEventPayload,
  ProviderConnectRelatedEventPayload,
  ProviderEventMap,
  ProviderInitiatedEventPayload,
} from '@/types'

export class ProviderEventBus {
  readonly #emitter = new EventEmitter<ProviderEventMap>()

  public get emitter(): EventEmitter<ProviderEventMap> {
    return this.#emitter
  }

  public emitInitiated(e: ProviderInitiatedEventPayload): void {
    this.#emitter.emit(PROVIDER_EVENT_BUS_EVENTS.Initiated, e)
  }

  public emitConnect(e: ProviderConnectRelatedEventPayload): void {
    this.#emitter.emit(PROVIDER_EVENT_BUS_EVENTS.Connect, e)
  }

  public emitDisconnect(e: ProviderConnectRelatedEventPayload): void {
    this.#emitter.emit(PROVIDER_EVENT_BUS_EVENTS.Disconnect, e)
  }

  public emitAccountChanged(e: ProviderConnectRelatedEventPayload): void {
    this.#emitter.emit(PROVIDER_EVENT_BUS_EVENTS.AccountChanged, e)
  }

  public emitChainChanged(e: ProviderChainChangedEventPayload): void {
    this.#emitter.emit(PROVIDER_EVENT_BUS_EVENTS.ChainChanged, e)
  }

  public emitBeforeTxSent(e: ProviderBeforeTxSentEventPayload): void {
    this.#emitter.emit(PROVIDER_EVENT_BUS_EVENTS.beforeTxSent, e)
  }

  public emitAfterTxSent(e: ProviderAfterTxSentEventPayload): void {
    this.#emitter.emit(PROVIDER_EVENT_BUS_EVENTS.afterTxSent, e)
  }

  public emitAfterTxConfirmed(e: ProviderAfterTxConfirmedEventPayload): void {
    this.#emitter.emit(PROVIDER_EVENT_BUS_EVENTS.afterTxConfirmed, e)
  }

  public onBeforeTxSent(
    cb: (e: ProviderBeforeTxSentEventPayload) => void,
  ): void {
    this.#emitter.on(PROVIDER_EVENT_BUS_EVENTS.beforeTxSent, cb)
  }

  public onAfterTxSent(cb: (e: ProviderAfterTxSentEventPayload) => void): void {
    this.#emitter.on(PROVIDER_EVENT_BUS_EVENTS.afterTxSent, cb)
  }

  public onAfterTxConfirmed(
    cb: (e: ProviderAfterTxConfirmedEventPayload) => void,
  ): void {
    this.#emitter.on(PROVIDER_EVENT_BUS_EVENTS.afterTxConfirmed, cb)
  }

  public onInitiated(cb: (e: ProviderInitiatedEventPayload) => void): void {
    this.#emitter.once(PROVIDER_EVENT_BUS_EVENTS.Initiated, cb)
  }

  public onConnect(cb: (e: ProviderConnectRelatedEventPayload) => void): void {
    this.#emitter.on(PROVIDER_EVENT_BUS_EVENTS.Connect, cb)
  }

  public onDisconnect(
    cb: (e: ProviderConnectRelatedEventPayload) => void,
  ): void {
    this.#emitter.on(PROVIDER_EVENT_BUS_EVENTS.Disconnect, cb)
  }

  public onAccountChanged(
    cb: (e: ProviderConnectRelatedEventPayload) => void,
  ): void {
    this.#emitter.on(PROVIDER_EVENT_BUS_EVENTS.AccountChanged, cb)
  }

  public onChainChanged(
    cb: (e: ProviderChainChangedEventPayload) => void,
  ): void {
    this.#emitter.on(PROVIDER_EVENT_BUS_EVENTS.ChainChanged, cb)
  }

  public clearHandlers(): void {
    this.#emitter.clear()
  }
}
