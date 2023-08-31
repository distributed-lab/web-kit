export type WalletConnectInitArgs = {
  projectId: string
  currentChains: [number, ...number[]]
  optionalChains?: [number, ...number[]]
}
