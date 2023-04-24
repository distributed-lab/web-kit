// @ts-nocheck
import { onUnmounted, reactive, ref, toRefs } from 'vue'
import {
  Chain,
  ChainId,
  CreateProviderOpts,
  TransactionResponse,
  TxRequestBody,
  ProviderProxyConstructor,
  createProvider,
  PROVIDERS,
  Provider,
  RawProvider,
} from '@distributedlab/w3p'

type ProviderState = {
  address?: string
  chainId?: ChainId
  chainType?: string
  isConnected?: boolean
  providerType?: PROVIDERS
  chainDetails?: Chain
}

export const useProvider = () => {
  let _provider: Provider | undefined

  const _providerReactiveState = reactive<ProviderState>({
    address: '',
    chainId: '',
    chainType: '',
    isConnected: false,
    providerType: undefined,
    chainDetails: undefined,
  })

  const rawProvider = ref<RawProvider>()

  const init = async (
    providerProxyConstructor: ProviderProxyConstructor,
    createProviderOpts: CreateProviderOpts,
  ) => {
    try {
      _provider = await createProvider(providerProxyConstructor, {
        providerDetector: createProviderOpts.providerDetector,
        listeners: {
          onAccountChanged: _updateProviderState,
          onChainChanged: _updateProviderState,
          onConnect: _updateProviderState,
          onDisconnect: _updateProviderState,
          ...createProviderOpts.listeners,
        },
      })

      rawProvider.value = createProviderOpts.providerDetector?.getProvider(
        providerProxyConstructor.providerType,
      )?.instance

      _updateProviderState()
    } catch (error) {
      console.error(error)
    }
  }

  const _updateProviderState = () => {
    _providerReactiveState.address = _provider?.address
    _providerReactiveState.chainId = String(_provider?.chainId)
    _providerReactiveState.chainType = _provider?.chainType
    _providerReactiveState.isConnected = _provider?.isConnected
    _providerReactiveState.providerType = _provider?.providerType
    _providerReactiveState.chainDetails = _provider?.chainDetails
  }

  const connect = async () => {
    await _provider?.connect()
  }

  const switchChain = async (chainId: ChainId) => {
    await _provider?.switchChain(chainId)
  }

  const addChain = async (chain: Chain) => {
    await _provider?.addChain?.(chain)
  }

  const setChainDetails = (chain: Chain) => {
    _provider?.setChainDetails?.(chain)

    _updateProviderState()
  }

  const getAddressUrl = (chain: Chain, address: string) => {
    return _provider?.getAddressUrl?.(chain, address)
  }

  const getHashFromTx = (txResponse: TransactionResponse) => {
    return _provider?.getHashFromTx?.(txResponse)
  }

  const getTxUrl = (chain: Chain, txHash: string) => {
    return _provider?.getTxUrl?.(chain, txHash)
  }

  const signAndSendTx = async (txRequestBody: TxRequestBody) => {
    return _provider?.signAndSendTx?.(txRequestBody)
  }

  const signMessage = async (message: string) => {
    return _provider?.signMessage?.(message)
  }

  const disconnect = async () => {
    if (_provider?.disconnect) {
      await _provider.disconnect()

      return
    }

    _provider = undefined
  }

  onUnmounted(() => {
    _provider?.clearHandlers()
  })

  return {
    ...toRefs(_providerReactiveState),

    rawProvider,

    init,
    connect,
    switchChain,
    addChain,
    setChainDetails,
    getAddressUrl,
    getHashFromTx,
    getTxUrl,
    signAndSendTx,
    signMessage,

    disconnect,
  }
}
