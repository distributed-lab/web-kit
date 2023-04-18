// Values must be lowercase because we lowercase them in Web3.init
export enum PROVIDERS {
  Fallback = 'fallback',
  Metamask = 'metamask',
  Phantom = 'phantom',
  Coinbase = 'coinbase',
  Solflare = 'solflare',
  Near = 'near',
}

export enum PROVIDER_CHECKS {
  Fallback = 'isWeb3',
  Metamask = 'isMetaMask',

  // Not implemented yet
  Coinbase = 'isCoinbaseWallet',
  WalletConnect = 'isWalletConnect',
  Phantom = 'isPhantom',
  Solflare = 'isSolflare',
  Near = 'isNear',
}

export enum PROVIDER_EVENTS {
  Connect = 'connect',
  Disconnect = 'disconnect',
  ChainChanged = 'chainChanged',
  AccountsChanged = 'accountsChanged',
  AccountChanged = 'accountChanged',
}

export enum PROVIDER_EVENT_BUS_EVENTS {
  Connect = 'connect',
  Disconnect = 'disconnect',
  ChainChanged = 'chain-changed',
  AccountChanged = 'account-changed',
  Initiated = 'initiated',

  beforeTxSent = 'before-tx-sent',
  afterTxSent = 'after-tx-sent',
  afterTxConfirmed = 'after-tx-confirmed',
}
