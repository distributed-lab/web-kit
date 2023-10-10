import { PROVIDERS } from '@/enums'
import type { ProviderProxy, RawProvider } from '@/types'

import { BaseEVMProvider } from './_base-evm'

/**
 * @description Represents a Coinbase wallet.
 *
 * @example
 * ```js
 * import { createProvider, CoinbaseProvider } from '@distributedlab/w3p'
 *
 * const getCoinbaseWalletAddress = async () => {
 *   // Connect to the Coinbase wallet in the browser using Web3.js, using the CoinbaseProvider interface to limit bundle size.
 *   const provider = await createProvider(CoinbaseProvider)
 *   await provider.connect()
 *
 *   // Get the address of the wallet
 *   console.log(provider.address)
 * }
 * ```
 */
export class CoinbaseProvider extends BaseEVMProvider implements ProviderProxy {
  constructor(provider: RawProvider) {
    super(provider)
  }

  static get providerType(): PROVIDERS {
    return PROVIDERS.Coinbase
  }
}
