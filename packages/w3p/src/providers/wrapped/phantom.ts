import {
  Cluster,
  clusterApiUrl,
  Connection,
  Transaction as SolTransaction,
} from '@solana/web3.js'

import { PROVIDER_EVENT_BUS_EVENTS, PROVIDERS } from '@/enums'
import { decodeSolanaTx, handleSolError } from '@/helpers'
import {
  ProviderProxy,
  RawProvider,
  SolanaProviderRpcError,
  TransactionResponse,
  TxRequestBody,
} from '@/types'

import { BaseSolanaProvider } from './_base-solana'

/**
 * @description Represents a Phantom wallet.
 *
 * @example
 * ```js
 * import { createProvider, PhantomProvider } from '@rarimo/provider'
 *
 * const getPhantomWalletAddress = async () => {
 *   // Connect to the Phantom wallet in the browser using Web3.js, using the PhantomProvider interface to limit bundle size.
 *   const provider = await createProvider(PhantomProvider)
 *   await provider.connect()
 *
 *   // Get the address of the wallet
 *   console.log(provider.address)
 * }
 * ```
 */
export class PhantomProvider
  extends BaseSolanaProvider
  implements ProviderProxy
{
  constructor(provider: RawProvider) {
    super(provider)
  }

  static get providerType(): PROVIDERS {
    return PROVIDERS.Phantom
  }

  async signAndSendTx(
    txRequestBody: TxRequestBody,
  ): Promise<TransactionResponse> {
    try {
      const txBody =
        typeof txRequestBody === 'string'
          ? decodeSolanaTx(txRequestBody)
          : txRequestBody

      this.emit(PROVIDER_EVENT_BUS_EVENTS.BeforeTxSent, txBody)

      const connection = new Connection(clusterApiUrl(this.chainId as Cluster))

      const { signature } = await this.provider.signAndSendTransaction(
        txBody as SolTransaction,
      )

      this.emit(PROVIDER_EVENT_BUS_EVENTS.AfterTxSent, {
        txHash: signature,
      })

      await connection.confirmTransaction(signature)

      this.emit(PROVIDER_EVENT_BUS_EVENTS.AfterTxConfirmed, {
        txHash: signature,
      })

      return signature
    } catch (error) {
      handleSolError(error as SolanaProviderRpcError)
    }

    return ''
  }
}
