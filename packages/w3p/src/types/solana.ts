import type {
  PublicKey,
  SendOptions,
  Transaction,
  TransactionSignature,
} from '@solana/web3.js'

type DisplayEncoding = 'utf8' | 'hex'

type PhantomEvent = 'disconnect' | 'connect' | 'accountChanged'

interface ConnectOpts {
  onlyIfTrusted: boolean
}

type PhantomRequestMethod =
  | 'connect'
  | 'disconnect'
  | 'signTransaction'
  | 'signAllTransactions'
  | 'signMessage'

/* eslint-disable @typescript-eslint/no-explicit-any */
export type SolanaProvider = {
  publicKey: PublicKey | null
  isConnected: boolean | null
  signTransaction: (transaction: Transaction) => Promise<Transaction>
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>
  signMessage: (
    message: Uint8Array | string,
    display?: DisplayEncoding,
  ) => Promise<unknown>
  signAndSendTransaction(
    transaction: Transaction,
    options?: SendOptions,
  ): Promise<{ signature: TransactionSignature }>
  connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>
  on: (event: PhantomEvent, handler: (args: unknown) => void) => void
  request: (method: PhantomRequestMethod, params: any) => Promise<unknown>
}
/* eslint-enable */

export type SolanaProviderRpcError = {
  error: {
    code: number
    message: string
  }
  name: string
  code?: number
  message?: string
}
