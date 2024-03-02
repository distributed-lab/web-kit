import {
  createProvider,
  MetamaskProvider,
  Provider,
  ProviderDetector,
  ProviderProxyConstructor,
  PROVIDERS,
} from '@distributedlab/w3p'
import { ref } from 'valtio'

import { createStore } from '@/helpers'

type Web3Store = {
  provider: Provider | undefined
}

const providerDetector = new ProviderDetector()

const PROVIDERS_PROXIES: { [key in PROVIDERS]?: ProviderProxyConstructor } = {
  [PROVIDERS.Metamask]: MetamaskProvider,
}

export const [web3Store, useWeb3State] = createStore(
  'web3',
  {
    provider: undefined,
  } as Web3Store,
  state => ({
    connect: async (providerType: PROVIDERS) => {
      if (!(providerType in PROVIDERS_PROXIES)) throw new TypeError('Provider not supported')

      const providerProxy = PROVIDERS_PROXIES[providerType]

      if (!providerProxy) throw new TypeError('Provider not supported')

      state.provider?.clearHandlers?.()

      state.provider = ref(
        await createProvider(providerProxy, {
          providerDetector,
          listeners: {
            onChainChanged: () => {
              web3Store.connect(providerType)
            },
            onAccountChanged: () => {
              web3Store.connect(providerType)
            },
          },
        }),
      )

      await state.provider.connect()
    },
  }),
  {
    isPersist: false,
  },
)
