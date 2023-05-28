import { computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { useUniversalStorage } from '@/composables'
import { config } from '@config'
import {
  CoinbaseProvider,
  // EthereumProvider,
  MetamaskProvider,
  FallbackEvmProvider,
  ProviderDetector,
  ProviderInstance,
  PROVIDERS,
  // ProviderEventPayload,
  // RawProvider,
  ProviderProxyConstructor,
  // Provider,
  // wrapExternalEthProvider,
} from '@distributedlab/w3p'
// import { TokenEProvider, useProvider, EXTERNAL_PROVIDERS } from '@tokene/vue-web3-provider'
import { useProvider } from './vue-use-provider-composable'
// import { providers } from 'ethers'

import {
  // getSupportedChainsDetails
} from '@/helpers'

const STORE_NAME = 'web3-providers-store'

/**
 * EXTERNAL_PROVIDERS are the custom providers for specific project
 * you should create it in your project if you have some custom providers
 */
// type SUPPORTED_PROVIDERS = EXTERNAL_PROVIDERS | PROVIDERS

/**
 * By default you can use just PROVIDERS
 */
type SUPPORTED_PROVIDERS = PROVIDERS

export const useWeb3ProvidersStore = defineStore(STORE_NAME, () => {
  /**
   * useProvider composable is the reactive wrapper for w3p,
   * you can copy https://github.com/distributed-lab/web-kit/blob/main/packages/w3p/examples/vue-use-provider-composable.ts
   * and paste in your project
   */
  const provider = useProvider()

  const providerDetector = computed(
    () => new ProviderDetector<SUPPORTED_PROVIDERS>(),
  )

  /**
   * The simple solution for keep providerType in
   * `localStorage` | `cookie` | `sessionStorage` or all of them
   *
   * Under the hood it returns ref, so pinia take it as state
   *
   * you can replace it with your own solution
   * for example use pinia persisted state
   */
  const storageState = useUniversalStorage<{
    providerType?: SUPPORTED_PROVIDERS
  }>(
    STORE_NAME,
    {
      providerType: provider.providerType?.value,
    },
    {
      isLocalStorage: true,
      isCookieStorage: true,
    },
  )

  watch(
    () => provider.providerType?.value,
    () => {
      storageState.value.providerType = provider.providerType?.value
    },
  )

  const isValidChain = computed(
    () =>
      String(provider.chainId?.value).toLowerCase() ===
      config.SUPPORTED_CHAIN_ID.toLowerCase(),
  )

  /**
   * init method shoud be called at the top level of your app to define connected provider e.g. after refreshing page,
   * and if it founds providerType in storage it will try to connect to it
   * Furthermore you can call init method with providerType param to connect to specific provider
   *
   * in common case you can show list of supported providers and choose on of them
   * @param providerType
   */
  async function init(providerType?: SUPPORTED_PROVIDERS) {
    try {
      await providerDetector.value.init()

      /**
       * In the case where you have some custom provider
       * you can add it by following code
       */
      // if (window.tokene) {
      //   await providerDetector.value.addProvider({
      //     name: EXTERNAL_PROVIDERS.TokenE,
      //     instance: wrapExternalEthProvider(
      //       window.tokene as providers.ExternalProvider,
      //     ) as RawProvider,
      //   })
      // }

      /**
       * If you need to fetch some data from contracts aka view methods for unconnected users,
       * you can add fallback provider
       */
      // if (!providerDetector.value.providers[PROVIDERS.Fallback]) {
      //   addProvider({
      //     name: PROVIDERS.Fallback,
      //     instance: new providers.JsonRpcProvider(
      //       config.SUPPORTED_CHAIN_RPC_URL,
      //       'any',
      //     ) as unknown as EthereumProvider,
      //   })
      // }

      /**
       * If you need to do smthng with chain details e.g. show link to explorer after tx sent
       */
      // Provider.setChainsDetails(getSupportedChainsDetails())

      /**
       * All supported providers, which should be defined, because
       */
      const supportedProviders: {
        [key in SUPPORTED_PROVIDERS]?: ProviderProxyConstructor
      } = {
        [PROVIDERS.Fallback]: FallbackEvmProvider,
        [PROVIDERS.Metamask]: MetamaskProvider,
        [PROVIDERS.Coinbase]: CoinbaseProvider,
        // in the case where you have some custom provider, place your ProviderProxyConstructor here
        // [EXTERNAL_PROVIDERS.TokenE]: TokenEProvider as ProviderProxyConstructor,
      }

      const currentProviderType: SUPPORTED_PROVIDERS =
        providerType ?? storageState.value.providerType ?? PROVIDERS.Fallback

      const providerProxyConstructor: ProviderProxyConstructor =
        supportedProviders[currentProviderType]!

      await provider.init<SUPPORTED_PROVIDERS>(providerProxyConstructor, {
        providerDetector: providerDetector.value,
        // if you need to do smthng on some event, you can define handlers here
        // listeners: {
        //   onTxSent,
        //   onTxConfirmed,
        //   ...,
        // },
      })

      if (!provider.isConnected?.value) {
        await provider.connect()
      }
    } catch (error) {
      storageState.value.providerType = undefined
    }
  }

  function addProvider(provider: ProviderInstance) {
    if (providerDetector.value.providers?.[provider.name]) return

    providerDetector.value.addProvider(provider)
  }

  async function disconnect() {
    try {
      await provider.disconnect()
      // eslint-disable-next-line no-empty
    } catch (error) {}

    storageState.value.providerType = undefined

    await init()
  }

  return {
    provider,
    providerDetector,

    isValidChain,

    init,
    addProvider,
    disconnect,
  }
})
