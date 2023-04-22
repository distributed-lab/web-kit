import type { Wallet, WalletSelector } from '@near-wallet-selector/core'

import type { TransactionResponse, TxRequestBody } from './provider'

export enum ENearWalletId {
  MyNearWallet = 'my-near-wallet',
}

export type NearTxRequestBody = {
  contractId: string
  method: string
  args?: Record<string, unknown>
  gas?: string
  deposit?: string
}

export type NearProviderType = {
  selector: WalletSelector | null
  wallet: Wallet | null
  createAccessKeyFor: string
  accountId: string
  init: () => Promise<void>
  signIn: () => Promise<void>
  signOut: () => Promise<void>
  isConnected: boolean | null
  signAndSendTx(
    txRequestBody: TxRequestBody | NearTxRequestBody,
  ): Promise<TransactionResponse>
  getHashFromTxResponse(txResponse: TransactionResponse): string
  connect: () => Promise<void>
}

export type NearProviderRpcError = {
  name: string
  cause: {
    info: unknown
    name: string
  }
  code: number
  data: unknown
  message: string
}
