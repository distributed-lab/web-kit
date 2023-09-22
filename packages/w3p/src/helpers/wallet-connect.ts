import { PROVIDER_EVENTS } from '@/enums'

export const createWalletConnectEthNamespace = () => ({
  eip155: {
    methods: [
      'wallet_switchEthereumChain',
      'wallet_addEthereumChain',
      'eth_requestAccounts',

      'eth_sendTransaction',

      'eth_sign',
      'personal_sign',
      'eth_signTypedData',
    ],
    chains: ['eip155:1'],
    events: [
      PROVIDER_EVENTS.Connect,
      PROVIDER_EVENTS.Disconnect,
      PROVIDER_EVENTS.ChainChanged,
      PROVIDER_EVENTS.AccountsChanged,
    ],
  },
})
