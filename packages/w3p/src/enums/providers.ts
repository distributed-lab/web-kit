export enum PROVIDERS {
  Fallback = 'fallback',
  Metamask = 'metamask',
  Phantom = 'phantom',
  Coinbase = 'coinbase',
  Solflare = 'solflare',
  Near = 'near',
  WalletConnect = 'wallet-connect',
  MetamaskFallback = 'metamask-fallback',
}

export enum PROVIDER_CHECKS {
  Fallback = 'isWeb3',
  Metamask = 'isMetaMask',
  Coinbase = 'isCoinbaseWallet',
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

  BeforeTxSent = 'before-tx-sent',
  TxSent = 'tx-sent',
  TxConfirmed = 'tx-confirmed',
}
