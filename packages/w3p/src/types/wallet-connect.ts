import Provider from '@walletconnect/ethereum-provider'

// TODO: MAYBE NEED TO MOVE SOMEWHERE
type NonEmptyArray<T> = [T, ...T[]]

export type WalletConnectInitArgs = {
  projectId: string
  currentChains: NonEmptyArray<number>
  optionalChains?: NonEmptyArray<number>
}

export type WalletConnectRawProvider = Provider
