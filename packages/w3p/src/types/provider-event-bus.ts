import { PROVIDER_EVENT_BUS_EVENTS } from '@/enums'
import type { TransactionResponse, TxRequestBody } from '@/types'

import type { ChainId } from './chain'

export type ProviderEventPayload = {
  address?: string
  isConnected?: boolean
  chainId?: ChainId
  txBody?: TxRequestBody
  txHash?: string
  txResponse?: TransactionResponse
}

export type ProviderEventMap = {
  [PROVIDER_EVENT_BUS_EVENTS.Connect]: ProviderEventPayload
  [PROVIDER_EVENT_BUS_EVENTS.Disconnect]: ProviderEventPayload
  [PROVIDER_EVENT_BUS_EVENTS.AccountChanged]: ProviderEventPayload
  [PROVIDER_EVENT_BUS_EVENTS.ChainChanged]: ProviderEventPayload
  [PROVIDER_EVENT_BUS_EVENTS.Initiated]: ProviderEventPayload

  [PROVIDER_EVENT_BUS_EVENTS.BeforeTxSent]: ProviderEventPayload
  [PROVIDER_EVENT_BUS_EVENTS.TxSent]: ProviderEventPayload
  [PROVIDER_EVENT_BUS_EVENTS.TxConfirmed]: ProviderEventPayload
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
  onTxSent(cb: (e: ProviderEventPayload) => void): void
  onTxConfirmed(cb: (e: ProviderEventPayload) => void): void
}

export type ProviderListeners = {
  onInitiated?: ProviderEventCallback
  onConnect?: ProviderEventCallback
  onDisconnect?: ProviderEventCallback
  onAccountChanged?: ProviderEventCallback
  onChainChanged?: ProviderEventCallback

  onBeforeTxSent?: ProviderEventCallback
  onTxSent?: ProviderEventCallback
  onTxConfirmed?: ProviderEventCallback
}
