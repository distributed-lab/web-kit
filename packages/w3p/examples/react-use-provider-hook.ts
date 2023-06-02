// @ts-nocheck
import {
  Chain,
  ChainId,
  createProvider,
  CreateProviderOpts,
  IProvider,
  ProviderBase,
  ProviderEventPayload,
  ProviderProxyConstructor,
  TransactionResponse,
  TxRequestBody,
} from '@distributedlab/w3p'
import { useCallback, useEffect, useState } from 'react'

const PROVIDER_EVENTS: Array<keyof IProvider> = [
  'onInitiated',
  'onConnect',
  'onAccountChanged',
  'onChainChanged',
  'onDisconnect',
]

export const useProvider = (
  providerProxy: ProviderProxyConstructor,
  createProviderOpts?: CreateProviderOpts,
): ProviderBase & { provider: IProvider } => {
  const [provider, setProvider] = useState<IProvider>({} as IProvider)
  const [providerReactiveState, setProviderReactiveState] = useState(() => {
    return {
      address: provider?.address,
      isConnected: provider?.isConnected,
      chainId: provider?.chainId,
      chainType: provider?.chainType,
      providerType: provider?.providerType,
    }
  })

  const connect = async (): Promise<void> => provider.connect()

  const addChain = async (chain: Chain): Promise<void> =>
    provider.addChain?.(chain)

  const switchChain = async (chainId: ChainId): Promise<void> =>
    provider.switchChain(chainId)

  const signAndSendTx = async (
    txRequestBody: TxRequestBody,
  ): Promise<TransactionResponse> =>
    provider.signAndSendTx?.(txRequestBody) ?? ''

  const signMessage = async (message: string): Promise<string> =>
    provider.signMessage?.(message) ?? ''

  const getHashFromTx = (txResponse: TransactionResponse): string =>
    provider.getHashFromTx?.(txResponse) ?? ''

  const getTxUrl = (chain: Chain, txHash: string): string =>
    provider.getTxUrl?.(chain, txHash) ?? ''

  const getAddressUrl = (chain: Chain, address: string): string =>
    provider.getAddressUrl?.(chain, address) ?? ''

  const setListeners = useCallback(() => {
    if (!provider) return
    PROVIDER_EVENTS.forEach(event => {
      const providerEvent = provider[event] as (
        cb: (payload: ProviderEventPayload) => void,
      ) => void

      providerEvent?.call(provider, payload => {
        setProviderReactiveState(prev => ({
          ...prev,
          ...payload,
        }))
      })
    })
  }, [provider])

  useEffect(() => {
    const initProvider = async () => {
      const initedProvider = await createProvider(
        providerProxy,
        createProviderOpts,
      )
      setProvider(initedProvider)
    }

    initProvider()
  }, [providerProxy, createProviderOpts])

  useEffect(() => {
    provider?.clearHandlers()
    setListeners()

    setProviderReactiveState(prev => ({
      ...prev,
      address: provider?.address,
      isConnected: provider?.isConnected,
      chainId: provider?.chainId,
      chainType: provider?.chainType,
      providerType: provider?.providerType,
    }))

    return () => {
      provider?.clearHandlers()
    }
  }, [provider, setListeners])

  return {
    provider,
    ...providerReactiveState,
    connect,
    addChain,
    switchChain,
    signMessage,
    signAndSendTx,
    getTxUrl,
    getHashFromTx,
    getAddressUrl,
  }
}
