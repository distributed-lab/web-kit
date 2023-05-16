import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { useNotifications, useUniversalStorage } from '@/composables'
import { config } from '@config'
import { FallbackProvider } from '@/helpers'
import { useAuthStore } from '@/store'
import {
  CoinbaseProvider,
  EthereumProvider,
  MetamaskProvider,
  ProviderDetector,
  ProviderInstance,
  PROVIDERS,
  CHAIN_TYPES,
  ProviderEventPayload,
  RawProvider,
  ProviderProxyConstructor,
  Provider,
} from '@distributedlab/w3p'
import {
  TokenEProvider,
  useProvider,
  EXTERNAL_PROVIDERS,
} from '@tokene/vue-web3-provider'
import { ethers } from 'ethers'

import { DECIMALS } from '@distributedlab/tools'

const STORE_NAME = 'web3-providers-store'

type SUPPORTED_PROVIDERS = EXTERNAL_PROVIDERS | PROVIDERS

export const useWeb3ProvidersStore = defineStore(STORE_NAME, () => {
  const provider = useProvider()

  const providerDetector = computed(
    () => new ProviderDetector<EXTERNAL_PROVIDERS>(),
  )

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

  const lastToastId = ref<string | number>()
  const { showTxToast, removeToast } = useNotifications()

  const authStore = useAuthStore()

  const isValidChain = computed(
    () =>
      String(provider.chainId?.value).toLowerCase() ===
      config.SUPPORTED_CHAIN_ID.toLowerCase(),
  )

  function handleTxSent(e?: ProviderEventPayload) {
    if (!e?.txHash || !provider?.chainDetails) return

    const txLink = provider?.getTxUrl(provider.chainDetails.value!, e.txHash)

    lastToastId.value = showTxToast('pending', txLink!)
  }

  function handleTxConfirmed(e?: ProviderEventPayload) {
    if (!e?.txResponse || !provider?.getHashFromTx || !provider?.chainDetails)
      return

    const txLink = provider?.getTxUrl(
      provider.chainDetails.value!,
      provider.getHashFromTx(e.txResponse)!,
    )

    removeToast(lastToastId.value!)
    showTxToast('success', txLink!)
  }

  async function init(providerType?: SUPPORTED_PROVIDERS) {
    try {
      await providerDetector.value.init()

      await providerDetector.value.addProvider({
        name: EXTERNAL_PROVIDERS.TokenE,
        instance: window.tokene as RawProvider,
      })

      /**
       * Some platform need handle a multiple chains connection, so if it is, for the fallback providers
       * you just need to define all of them in supportedProvidersMap, every fallBack provider instance per chain
       */
      if (!providerDetector.value.providers[PROVIDERS.Fallback]) {
        addProvider({
          name: PROVIDERS.Fallback,
          instance: new ethers.providers.JsonRpcProvider(
            config.SUPPORTED_CHAIN_RPC_URL,
            'any',
          ) as unknown as EthereumProvider,
        })
      }

      const supportedProviders: {
        [key in SUPPORTED_PROVIDERS]?: ProviderProxyConstructor
      } = {
        [PROVIDERS.Fallback]: FallbackProvider,
        [PROVIDERS.Metamask]: MetamaskProvider,
        [PROVIDERS.Coinbase]: CoinbaseProvider,
        [EXTERNAL_PROVIDERS.TokenE]: TokenEProvider,
      }

      const currentProviderType: SUPPORTED_PROVIDERS =
        providerType ?? storageState.value.providerType ?? PROVIDERS.Fallback

      const providerProxyConstructor: ProviderProxyConstructor =
        supportedProviders[currentProviderType]!

      await provider.init(providerProxyConstructor, {
        providerDetector: providerDetector.value,
        listeners: {
          onTxSent: handleTxSent,
          onTxConfirmed: handleTxConfirmed,
        },
      })

      if (!provider.isConnected?.value) {
        await provider.connect()
      }

      Provider.setChainsDetails({
        [config.SUPPORTED_CHAIN_ID]: {
          id: config.SUPPORTED_CHAIN_ID,
          name: config.SUPPORTED_CHAIN_NAME,
          rpcUrl: config.SUPPORTED_CHAIN_RPC_URL,
          explorerUrl: config.SUPPORTED_CHAIN_EXPLORER_URL,
          token: {
            name: 'Token Name',
            symbol: 'TKN',
            decimals: DECIMALS.WEI,
          },
          type: CHAIN_TYPES.EVM,
          icon: '',
        },
      })

      if (provider.address?.value) {
        const authStore = useAuthStore()
        await authStore.login(provider.address!.value!)
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

    await authStore.logout()

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
