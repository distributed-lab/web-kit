import type { providers } from 'ethers'

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface EthereumProvider extends providers.ExternalProvider {
  once(eventName: string | symbol, listener: (...args: any[]) => void): this
  on(eventName: string | symbol, listener: (...args: any[]) => void): this
  off(eventName: string | symbol, listener: (...args: any[]) => void): this
  addListener(
    eventName: string | symbol,
    listener: (...args: any[]) => void,
  ): this
  removeListener(
    eventName: string | symbol,
    listener: (...args: any[]) => void,
  ): this
  removeAllListeners(event?: string | symbol): this
  providers?: this[]
  selectedAddress: string | null
  request: (...args: any[]) => Promise<void>
}

export type EthProviderRpcError = {
  message: string
  code: number | string
  data?: unknown
}
