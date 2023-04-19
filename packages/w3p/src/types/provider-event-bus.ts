import { PROVIDER_EVENT_BUS_EVENTS } from '@/enums'
import { TransactionResponse, TxRequestBody } from '@/types'

import { ChainId } from './chain'

export type ProviderConnectRelatedEventPayload = {
  address?: string
  isConnected: boolean
}

export type ProviderChainChangedEventPayload = { chainId?: ChainId }

export type ProviderInitiatedEventPayload = ProviderConnectRelatedEventPayload &
  ProviderChainChangedEventPayload

export type ProviderBeforeTxSentEventPayload = TxRequestBody

export type ProviderAfterTxSentEventPayload = {
  txHash: string
}

export type ProviderAfterTxConfirmedEventPayload = TransactionResponse

export type ProviderEventPayload =
  | ProviderConnectRelatedEventPayload
  | ProviderChainChangedEventPayload
  | ProviderInitiatedEventPayload
  | ProviderBeforeTxSentEventPayload
  | ProviderAfterTxSentEventPayload
  | ProviderAfterTxConfirmedEventPayload

export type ProviderEventMap = {
  [PROVIDER_EVENT_BUS_EVENTS.Connect]: ProviderConnectRelatedEventPayload
  [PROVIDER_EVENT_BUS_EVENTS.Disconnect]: ProviderConnectRelatedEventPayload
  [PROVIDER_EVENT_BUS_EVENTS.AccountChanged]: ProviderConnectRelatedEventPayload
  [PROVIDER_EVENT_BUS_EVENTS.ChainChanged]: ProviderChainChangedEventPayload
  [PROVIDER_EVENT_BUS_EVENTS.Initiated]: ProviderInitiatedEventPayload

  [PROVIDER_EVENT_BUS_EVENTS.BeforeTxSent]: ProviderBeforeTxSentEventPayload
  [PROVIDER_EVENT_BUS_EVENTS.AfterTxSent]: ProviderAfterTxSentEventPayload
  [PROVIDER_EVENT_BUS_EVENTS.AfterTxConfirmed]: ProviderAfterTxConfirmedEventPayload
}

export type ProviderEventCallback = (e: ProviderEventPayload) => void

export interface ProviderSubscriber {
  onInitiated(cb: (e: ProviderEventPayload) => void): void
  onConnect(cb: (e: ProviderEventPayload) => void): void
  onDisconnect(cb: (e: ProviderEventPayload) => void): void
  onAccountChanged(cb: (e: ProviderEventPayload) => void): void
  onChainChanged?(cb: (e: ProviderEventPayload) => void): void
  clearHandlers(): void

  onBeforeTxSent(cb: (e: ProviderEventPayload) => void): void
  onAfterTxSent(cb: (e: ProviderEventPayload) => void): void
  onAfterTxConfirmed(cb: (e: ProviderEventPayload) => void): void
}

export type ProviderListeners = {
  onInitiated?: ProviderEventCallback
  onConnect?: ProviderEventCallback
  onDisconnect?: ProviderEventCallback
  onAccountChanged?: ProviderEventCallback
  onChainChanged?: ProviderEventCallback

  onBeforeTxSent?: ProviderEventCallback
  onAfterTxSent?: ProviderEventCallback
  onAfterTxConfirmed?: ProviderEventCallback
}
