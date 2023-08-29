import type { TransactionRequest } from '@ethersproject/abstract-provider'
import type { Deferrable } from '@ethersproject/properties'
import type {
  Transaction as SolTransaction,
  TransactionSignature,
} from '@solana/web3.js'
import type { providers } from 'ethers'

import type { CHAIN_TYPES, PROVIDERS } from '@/enums'
import type { WalletConnectInitArgs } from '@/types'

import type { Chain, ChainId } from './chain'
import type { EthereumProvider } from './ethereum'
import type {
  NearRawProvider,
  NearTransactionResponse,
  NearTxRequestBody,
} from './near'
import type {
  ProviderListeners,
  ProviderSubscriber,
} from './provider-event-bus'
import type { SolanaProvider } from './solana'
import type { WalletConnectRawProvider } from './wallet-connect'

export type RawProvider =
  | EthereumProvider
  | SolanaProvider
  | NearRawProvider
  | WalletConnectRawProvider
  | WalletConnectInitArgs

export type ProviderInstance<T extends keyof Record<string, string> = never> = {
  name: T | PROVIDERS
  instance?: RawProvider
}

export type ProviderConstructorMap = {
  [key in PROVIDERS]?: ProviderProxyConstructor
}

export type TxRequestBody =
  | Deferrable<TransactionRequest>
  | SolTransaction
  | NearTxRequestBody
  | string

export type EthTransactionResponse = providers.TransactionReceipt

export type SolanaTransactionResponse = TransactionSignature

export type TransactionResponse =
  | EthTransactionResponse
  | SolanaTransactionResponse
  | NearTransactionResponse

export interface ProviderBase {
  chainId?: ChainId
  chainType?: CHAIN_TYPES
  address?: string
  rawProvider?: RawProvider
  connectUri?: string
  isConnected: boolean

  connect?: () => Promise<void>

  addChain?: (chain: Chain) => Promise<void>
  switchChain?: (chainId: ChainId) => Promise<void>

  signAndSendTx?: (txRequestBody: TxRequestBody) => Promise<TransactionResponse>
  signMessage?: (message: string) => Promise<string>

  getHashFromTx?: (txResponse: TransactionResponse) => string
  getTxUrl?: (chain: Chain, txHash: string) => string
  getAddressUrl?: (chain: Chain, address: string) => string

  disconnect?: () => Promise<void>
}

export interface ProviderProxy extends ProviderBase, ProviderSubscriber {
  init: () => Promise<void>
}

export interface IProvider extends ProviderBase, ProviderSubscriber {
  providerType?: string
  init: (
    provider: ProviderInstance,
    listeners?: ProviderListeners,
  ) => Promise<this>

  connect: () => Promise<void>
  chainDetails?: Chain
}

export interface ProviderProxyConstructor {
  new (provider: RawProvider): ProviderProxy
  providerType: string
}
