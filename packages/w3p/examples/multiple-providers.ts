import { computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { useUniversalStorage } from '@/composables'
import { config } from '@config'
import {
  CoinbaseProvider,
  MetamaskProvider,
  FallbackEvmProvider,
  ProviderDetector,
  ProviderInstance,
  PROVIDERS,
  ProviderProxyConstructor,
  WalletConnectEvmProvider,
} from '@distributedlab/w3p'
import { useProvider } from './vue-use-provider-composable'

const STORE_NAME = 'web3-providers-store'

/**
 * EXTERNAL_PROVIDERS are the custom providers for specific project
 * you should create it in your project if you have some custom providers
 *
 * enum EXTERNAL_PROVIDERS = {
 *   tokene = 'tokene',
 *   myCustomProvider = 'myCustomProvider',
 * }
 *
 * type SUPPORTED_PROVIDERS = EXTERNAL_PROVIDERS | PROVIDERS
 */

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
       *
       * if (window.tokene) {
       *   await providerDetector.value.addProvider({
       *     name: EXTERNAL_PROVIDERS.TokenE,
       *     instance: wrapExternalEthProvider(
       *       window.tokene as providers.ExternalProvider,
       *     ) as RawProvider,
       *   })
       * }

       * Since WalletConnect lacks an injected provider for
       * interacting with the chain, it's required to add
       * WalletConnect provider configuration with
       * the following method:
       *
       * await providerDetector.value.addProvider({
       *     name: PROVIDERS.WalletConnect,
       *     instance: {
       *       projectId: 'abcdefghijklmnopqrstuvwxyz',
       *       relayUrl: 'wss://relay.walletconnect.com',
       *       logger: 'info'
       *     } as RawProvider,
       *   })
       *
       */

      /**
       * If you need to fetch some data from contracts aka view methods for unconnected users,
       * you can add fallback provider
       *
       * if (!providerDetector.value.providers[PROVIDERS.Fallback]) {
       *   addProvider({
       *     name: PROVIDERS.Fallback,
       *     instance: new providers.JsonRpcProvider(
       *       config.SUPPORTED_CHAIN_RPC_URL,
       *       'any',
       *     ) as unknown as EthereumProvider,
       *   })
       * }
       */

      /**
       * If you need to do something with chain details e.g. show link to explorer after tx sent
       *
       * Provider.setChainsDetails(getSupportedChainsDetails())
       */

      /**
       * If you need to do something with chain details e.g. show link to explorer after tx sent
       *
       * Provider.setChainsDetails(getSupportedChainsDetails())
       */

      /**
       * To define a custom RPC network that the WalletConnect provider
       * will use, you need to specify the chain you want to define in
       * the Provider.setChainDetails method.
       *
       * Provider.setChainsDetails({
       *  5: {
       *    id: '0x5',
       *    name: 'Goerli',
       *    rpcUrl: 'https://goerli.blockpi.network/v1/rpc/public',
       *    explorerUrl: 'https://goerli.etherscan.io/',
       *    token: { name: 'Goerli', symbol: 'GTH', decimals: 18 },
       *    type: CHAIN_TYPES.EVM,
       *    icon: '',
       *  },
       * })
       */

      /**
       * All supported providers, which should be defined, because
       */
      const supportedProviders: {
        [key in SUPPORTED_PROVIDERS]?: ProviderProxyConstructor
      } = {
        [PROVIDERS.Fallback]: FallbackEvmProvider,
        [PROVIDERS.Metamask]: MetamaskProvider,
        [PROVIDERS.Coinbase]: CoinbaseProvider,
        [PROVIDERS.WalletConnect]: WalletConnectEvmProvider,
        /**
         * in the case where you have some custom provider, place your ProviderProxyConstructor here
         * [EXTERNAL_PROVIDERS.TokenE]: TokenEProvider as ProviderProxyConstructor,
         */
      }

      const currentProviderType: SUPPORTED_PROVIDERS =
        providerType ?? storageState.value.providerType ?? PROVIDERS.Fallback

      const providerProxyConstructor: ProviderProxyConstructor =
        supportedProviders[currentProviderType]!

      await provider.init<SUPPORTED_PROVIDERS>(providerProxyConstructor, {
        providerDetector: providerDetector.value,
        /**
         * if you need to do something on some event, you can define handlers here
         *
         * listeners: {
         *   onTxSent,
         *   onTxConfirmed,
         *   ...,
         * },
         */
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
