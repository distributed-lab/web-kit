import Provider from '@walletconnect/ethereum-provider'

export type WalletConnectInitArgs = {
  projectId: string
  currentChain: number
  optionalChains: number[]
}

export type WalletConnectRawProvider = Provider
