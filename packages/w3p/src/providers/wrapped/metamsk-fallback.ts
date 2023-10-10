import { PROVIDERS } from '@/enums'
import type { ProviderProxy, RawProvider } from '@/types'

import { BaseEVMProvider } from './_base-evm'

/**
 * @description Represents a Fallback Metamask wallet.
 *
 * @example
 * ```js
 * import { createProvider, MetamaskFallbackProvider } from '@distributedlab/w3p'
 *
 * const getMetamaskWalletAddress = async () => {
 *   // Create a provider with MetamaskFallbackProvider
 *   const provider = await createProvider(MetamaskProvider)
 *    // Connect provider, this step will redirect you to Metamask browser on your mobile device
 *   await provider.connect()
 * }
 * ```
 */
export class MetamaskFallbackProvider
  extends BaseEVMProvider
  implements ProviderProxy
{
  constructor(provider: RawProvider) {
    super(provider)
  }

  static get providerType(): PROVIDERS {
    return PROVIDERS.MetamaskFallback
  }

  async init() {
    return
  }

  async connect() {
    try {
      const urlToOpen = window.location.href.replace(
        window.location.protocol + '//',
        '',
      )
      const connectMetamaskUrl = `https://metamask.app.link/dapp/${urlToOpen}`

      window.open(connectMetamaskUrl)
    } catch (error) {
      window.location.reload()
    }
  }
}
