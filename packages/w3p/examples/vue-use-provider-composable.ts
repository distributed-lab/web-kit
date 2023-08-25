import {
  type Chain,
  type ChainId,
  createProvider,
  type CreateProviderOpts,
  Provider,
  type ProviderProxyConstructor,
  PROVIDERS,
  type RawProvider,
  type TransactionResponse,
  type TxRequestBody,
} from '@distributedlab/w3p'
import { onUnmounted, reactive, ref, toRefs } from 'vue'

type ProviderState = {
  address?: string
  chainId?: ChainId
  chainType?: string
  isConnected?: boolean
  connectUri?: string
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

  async function init<T extends keyof Record<string, string>>(
    providerProxyConstructor: ProviderProxyConstructor,
    createProviderOpts: CreateProviderOpts<T>,
  ) {
    try {
      _provider = await createProvider(providerProxyConstructor, {
        providerDetector: createProviderOpts.providerDetector,
        listeners: {
          ...createProviderOpts.listeners,
          onAccountChanged: () => {
            createProviderOpts?.listeners?.onAccountChanged?.()
            _updateProviderState()
          },
          onChainChanged: () => {
            createProviderOpts?.listeners?.onChainChanged?.()
            _updateProviderState()
          },
          onConnect: () => {
            createProviderOpts?.listeners?.onConnect?.()
            _updateProviderState()
          },
          onDisconnect: () => {
            createProviderOpts?.listeners?.onDisconnect?.()
            _updateProviderState()
          },
        },
      })

      rawProvider.value = createProviderOpts.providerDetector?.getProvider(
        providerProxyConstructor.providerType as PROVIDERS,
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
    if (_providerReactiveState.providerType) return

    _provider?.clearHandlers()
  })

  return {
    ...toRefs(_providerReactiveState),

    rawProvider,

    init,
    connect,
    switchChain,
    addChain,
    getAddressUrl,
    getHashFromTx,
    getTxUrl,
    signAndSendTx,
    signMessage,

    disconnect,
  }
}
