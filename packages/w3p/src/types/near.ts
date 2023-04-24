import type { Optional, Transaction } from '@near-wallet-selector/core'
import type { providers as nearProviders } from 'near-api-js'

export enum ENearWalletId {
  MyNearWallet = 'my-near-wallet',
}

export type NearTxRequestBody = {
  transactions: Array<Optional<Transaction, 'signerId'>>
}

export type { NearRawProvider } from '@/providers'

export type NearTransactionResponse = nearProviders.FinalExecutionOutcome[]

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
