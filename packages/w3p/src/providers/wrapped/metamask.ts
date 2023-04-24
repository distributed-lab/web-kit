import { PROVIDERS } from '@/enums'
import type { ProviderProxy, RawProvider } from '@/types'

import { BaseEVMProvider } from './_base-evm'

/**
 * @description Represents a Metamask wallet.
 *
 * @example
 * ```js
 * import { createProvider, MetamaskProvider } from '@rarimo/provider'
 *
 * const getMetamaskWalletAddress = async () => {
 *   // Connect to the Metamask wallet in the browser using Web3.js, using the MetamaskProvider interface to limit bundle size.
 *   const provider = await createProvider(MetamaskProvider)
 *   await provider.connect()
 *
 *   // Get the address of the wallet
 *   console.log(provider.address)
 * }
 * ```
 */
export class MetamaskProvider extends BaseEVMProvider implements ProviderProxy {
  constructor(provider: RawProvider) {
    super(provider)
  }

  static get providerType(): PROVIDERS {
    return PROVIDERS.Metamask
  }
}
