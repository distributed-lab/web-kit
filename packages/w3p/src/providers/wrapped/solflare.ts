import {
  type Cluster,
  clusterApiUrl,
  Connection,
  type Transaction as SolTransaction,
} from '@solana/web3.js'

import { PROVIDER_EVENT_BUS_EVENTS, PROVIDERS } from '@/enums'
import { decodeSolanaTx, handleSolError } from '@/helpers'
import type {
  ProviderProxy,
  RawProvider,
  SolanaProviderRpcError,
  TransactionResponse,
  TxRequestBody,
} from '@/types'

import { BaseSolanaProvider } from './_base-solana'

/**
 * @description Represents a Solflare wallet.
 *
 * @example
 * ```js
 * import { createProvider, SolflareProvider } from '@rarimo/provider'
 *
 * const getSolflareWalletAddress = async () => {
 *   // Connect to the Solflare wallet in the browser using Web3.js, using the SolflareProvider interface to limit bundle size.
 *   const provider = await createProvider(SolflareProvider)
 *   await provider.connect()
 *
 *   // Get the address of the wallet
 *   console.log(provider.address)
 * }
 * ```
 */
export class SolflareProvider
  extends BaseSolanaProvider
  implements ProviderProxy
{
  constructor(provider: RawProvider) {
    super(provider)
  }

  static get providerType(): PROVIDERS {
    return PROVIDERS.Solflare
  }

  async signAndSendTx(
    txRequestBody: TxRequestBody,
  ): Promise<TransactionResponse> {
    try {
      const txBody =
        typeof txRequestBody === 'string'
          ? decodeSolanaTx(txRequestBody)
          : txRequestBody

      this.emit(PROVIDER_EVENT_BUS_EVENTS.BeforeTxSent, { txBody })

      const signedTx = await this.provider.signTransaction(
        txBody as SolTransaction,
      )

      const connection = new Connection(clusterApiUrl(this.chainId as Cluster))

      const signature = await connection.sendRawTransaction(
        signedTx.serialize(),
      )

      this.emit(PROVIDER_EVENT_BUS_EVENTS.AfterTxSent, {
        txHash: signature,
      })

      await connection.confirmTransaction(signature)

      this.emit(PROVIDER_EVENT_BUS_EVENTS.AfterTxConfirmed, {
        txResponse: signature,
      })

      return signature
    } catch (error) {
      handleSolError(error as SolanaProviderRpcError)
    }

    return ''
  }
}
