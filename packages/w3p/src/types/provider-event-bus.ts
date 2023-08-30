import { PROVIDER_EVENT_BUS_EVENTS } from '@/enums'
import type { TransactionResponse, TxRequestBody } from '@/types'

import type { ChainId } from './chain'

export type ProviderEventPayload = {
  address?: string
  isConnected?: boolean
  chainId?: ChainId
  txBody?: TxRequestBody
  txHash?: string
  connectUri?: string
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
  [PROVIDER_EVENT_BUS_EVENTS.UriUpdate]: ProviderEventPayload
}

export type ProviderEventCallback = (e?: ProviderEventPayload) => void

export interface ProviderSubscriber {
  onInitiated(cb: ProviderEventCallback): void
  onConnect(cb: ProviderEventCallback): void
  onDisconnect(cb: ProviderEventCallback): void
  onAccountChanged(cb: ProviderEventCallback): void
  onChainChanged?(cb: ProviderEventCallback): void
  clearHandlers(): void

  onBeforeTxSent(cb: ProviderEventCallback): void
  onTxSent(cb: ProviderEventCallback): void
  onTxConfirmed(cb: ProviderEventCallback): void
  onUriUpdate?(cd: ProviderEventCallback): void
}

export type ProviderListeners = {
  [key in keyof Omit<
    ProviderSubscriber,
    'clearHandlers'
  >]?: ProviderEventCallback
}
