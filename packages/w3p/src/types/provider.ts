import { TransactionRequest } from '@ethersproject/abstract-provider'
import { Deferrable } from '@ethersproject/properties'
import {
  Transaction as SolTransaction,
  TransactionSignature,
} from '@solana/web3.js'
import { ethers } from 'ethers'
import { providers as nearProviders } from 'near-api-js'

import { CHAIN_TYPES, PROVIDERS } from '@/enums'

import { Chain, ChainId } from './chain'
import { EthereumProvider } from './ethereum'
import { NearProviderType } from './near'
import { ProviderSubscriber } from './provider-event-bus'
import { SolanaProvider } from './solana'

export type RawProvider = EthereumProvider | SolanaProvider | NearProviderType

export type ProviderInstance = {
  name: PROVIDERS
  instance?: RawProvider
}

export type TxRequestBody =
  | Deferrable<TransactionRequest>
  | SolTransaction
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

  signAndSendTx: (txRequestBody: TxRequestBody) => Promise<TransactionResponse>
  signMessage?: (message: string) => Promise<string>

  getHashFromTx?: (txResponse: TransactionResponse) => string
  getTxUrl?: (chain: Chain, txHash: string) => string
  getAddressUrl?: (chain: Chain, address: string) => string

  // EVM specific methods
  getRawProvider?: () => ethers.providers.Web3Provider
  getRawSigner?: () => ethers.providers.JsonRpcSigner
}

export interface ProviderProxy extends ProviderBase, ProviderSubscriber {
  init: () => Promise<void>
}

export interface IProvider extends ProviderBase, ProviderSubscriber {
  providerType?: PROVIDERS
  init: (provider: ProviderInstance) => Promise<this>
}

export interface ProviderProxyConstructor {
  new (provider: RawProvider): ProviderProxy
  providerType: PROVIDERS
}
