import {
  createProvider,
  MetamaskProvider,
  Provider,
  ProviderDetector,
  ProviderProxyConstructor,
  PROVIDERS,
} from '@distributedlab/w3p'
import { inject, provide, Ref, ref } from 'vue'

const providerDetector = new ProviderDetector()

const PROVIDERS_PROXIES: { [key in PROVIDERS]?: ProviderProxyConstructor } = {
  [PROVIDERS.Metamask]: MetamaskProvider,
}

const PROVIDE_NAME = 'web3'

type Web3State = {
  provider: Ref<Provider | undefined>
  connect: (providerType: PROVIDERS) => Promise<void>
}

export const useWeb3Provide = () => {
  const provider = ref<Provider>()

  const connect = async (providerType: PROVIDERS) => {
    if (!(providerType in PROVIDERS_PROXIES)) throw new TypeError('Provider not supported')

    const providerProxy = PROVIDERS_PROXIES[providerType]

    if (!providerProxy) throw new TypeError('Provider not supported')

    provider.value?.clearHandlers?.()

    provider.value = await createProvider(providerProxy, {
      providerDetector,
      listeners: {
        onChainChanged: () => {
          connect(providerType)
        },
        onAccountChanged: () => {
          connect(providerType)
        },
      },
    })

    await provider.value.connect()
  }

  provide<Web3State>(PROVIDE_NAME, {
    provider,
    connect,
  })
}

export const useWeb3Inject = () => {
  const web3 = inject<Web3State>(PROVIDE_NAME)

  if (!web3) throw new Error('useWeb3Inject must be used within a Web3Provider')

  return web3
}
