import type { TransactionRequest } from '@ethersproject/abstract-provider'
import type { Deferrable } from '@ethersproject/properties'
import type {
  Transaction as SolTransaction,
  TransactionSignature,
} from '@solana/web3.js'
import type { ethers } from 'ethers'
import type { providers as nearProviders } from 'near-api-js'

import type { CHAIN_TYPES, PROVIDERS } from '@/enums'

import type { Chain, ChainId } from './chain'
import type { EthereumProvider } from './ethereum'
import type { NearProviderType, NearTxRequestBody } from './near'
import type {
  ProviderListeners,
  ProviderSubscriber,
} from './provider-event-bus'
import type { SolanaProvider } from './solana'

export type RawProvider = EthereumProvider | SolanaProvider | NearProviderType

export type ProviderInstance = {
  name: PROVIDERS
  instance?: RawProvider
}

export type TxRequestBody =
  | Deferrable<TransactionRequest>
  | SolTransaction
  | NearTxRequestBody
  | string

export type EthTransactionResponse = ethers.providers.TransactionReceipt

export type SolanaTransactionResponse = TransactionSignature

export type NearTransactionResponse = nearProviders.FinalExecutionOutcome

export type TransactionResponse =
  | EthTransactionResponse
  | SolanaTransactionResponse
  | NearTransactionResponse

export interface ProviderBase {
  chainId?: ChainId
  chainType?: CHAIN_TYPES
  address?: string
  isConnected: boolean

  connect: () => Promise<void>

  addChain?: (chain: Chain) => Promise<void>
  switchChain: (chainId: ChainId) => Promise<void>

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
  providerType?: PROVIDERS
  init: (
    provider: ProviderInstance,
    listeners?: ProviderListeners,
  ) => Promise<this>

  chainDetails?: Chain
  setChainDetails?: (chain: Chain) => void
}

export interface ProviderProxyConstructor {
  new (provider: RawProvider): ProviderProxy
  providerType: PROVIDERS
}
