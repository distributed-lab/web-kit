import {
  createProvider,
  MetamaskProvider,
  Provider,
  ProviderDetector,
  ProviderProxyConstructor,
  PROVIDERS,
  RawProvider,
  WalletConnectEvmProvider,
} from '@distributedlab/w3p'
import { WalletConnectModal } from '@walletconnect/modal'
import { UniversalProvider } from '@walletconnect/universal-provider'
import { ref } from 'valtio'

import { createStore } from '@/helpers'

type Web3Store = {
  provider: Provider | undefined
}

const providerDetector = new ProviderDetector()

const PROVIDERS_PROXIES: { [key in PROVIDERS]?: ProviderProxyConstructor } = {
  [PROVIDERS.Metamask]: MetamaskProvider,
  [PROVIDERS.WalletConnect]: WalletConnectEvmProvider,
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

      if (!providerDetector.getProvider(providerType)) {
        providerDetector.addProvider({
          name: PROVIDERS.WalletConnect,
          instance: (await UniversalProvider.init({
            projectId: '',
            relayUrl: 'wss://relay.walletconnect.com',
            metadata: {
              name: 'React App',
              description: 'React App for WalletConnect',
              url: 'https://walletconnect.com/',
              icons: ['https://avatars.githubusercontent.com/u/37784886'],
            },
          })) as unknown as RawProvider,
        })
      }

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
            onWalletConnectDisplayUri: payload => {
              const walletConnectModal = new WalletConnectModal({
                projectId: '',
              })
              walletConnectModal.openModal({ uri: payload?.walletConnectDisplayUri })
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
