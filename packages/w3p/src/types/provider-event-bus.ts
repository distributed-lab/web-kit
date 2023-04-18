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

export type ProviderEventMap = {
  [PROVIDER_EVENT_BUS_EVENTS.Connect]: ProviderConnectRelatedEventPayload
  [PROVIDER_EVENT_BUS_EVENTS.Disconnect]: ProviderConnectRelatedEventPayload
  [PROVIDER_EVENT_BUS_EVENTS.AccountChanged]: ProviderConnectRelatedEventPayload
  [PROVIDER_EVENT_BUS_EVENTS.ChainChanged]: ProviderChainChangedEventPayload
  [PROVIDER_EVENT_BUS_EVENTS.Initiated]: ProviderInitiatedEventPayload

  [PROVIDER_EVENT_BUS_EVENTS.beforeTxSent]: ProviderBeforeTxSentEventPayload
  [PROVIDER_EVENT_BUS_EVENTS.afterTxSent]: ProviderAfterTxSentEventPayload
  [PROVIDER_EVENT_BUS_EVENTS.afterTxConfirmed]: ProviderAfterTxConfirmedEventPayload
}

export interface ProviderSubscriber {
  onInitiated(cb: (e: ProviderInitiatedEventPayload) => void): void
  onConnect(cb: (e: ProviderConnectRelatedEventPayload) => void): void
  onDisconnect(cb: (e: ProviderConnectRelatedEventPayload) => void): void
  onAccountChanged(cb: (e: ProviderConnectRelatedEventPayload) => void): void
  onChainChanged?(cb: (e: ProviderChainChangedEventPayload) => void): void
  clearHandlers(): void
}
