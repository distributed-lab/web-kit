import { DECIMALS } from '@distributedlab/tools'
import { type providers, utils } from 'ethers'

import { EIP1193, EIP1474 } from '@/enums'
import { errors } from '@/errors'
import type {
  Chain,
  ChainId,
  EthereumProvider,
  EthProviderRpcError,
} from '@/types'

export const getEthExplorerTxUrl = (chain: Chain, txHash: string): string => {
  return `${chain.explorerUrl}/tx/${txHash}`
}

export const getEthExplorerAddressUrl = (
  chain: Chain,
  address: string,
): string => {
  return `${chain.explorerUrl}/address/${address}`
}

export const requestSwitchEthChain = async (
  provider: providers.Web3Provider,
  chainId: ChainId,
): Promise<void> => {
  await provider.send('wallet_switchEthereumChain', [
    { chainId: utils.hexValue(chainId) },
  ])
}

export const requestAddEthChain = async (
  provider: providers.Web3Provider,
  chain: Chain,
): Promise<void> => {
  await provider.send('wallet_addEthereumChain', [
    {
      chainId: utils.hexValue(Number(chain.id)),
      chainName: chain.name,
      ...(chain.token.name &&
        chain.token.symbol && {
          nativeCurrency: {
            name: chain.token.name,
            symbol: chain.token.symbol,
            decimals: chain.token.decimals ?? DECIMALS.WEI,
          },
        }),
      rpcUrls: [chain.rpcUrl],
      blockExplorerUrls: [...(chain.explorerUrl ? [chain.explorerUrl] : [])],
      ...(chain.icon && { iconUrls: [chain.icon] }),
    },
  ])
}

export const connectEthAccounts = async (provider: providers.Web3Provider) => {
  await provider.send('eth_requestAccounts', [])
}

export function handleEthError(
  error: EthProviderRpcError,
  defaultHandlerFn?: (error: EthProviderRpcError) => unknown,
): never {
  switch (error.code) {
    case EIP1193.UserRejectedRequest:
      throw new errors.ProviderUserRejectedRequest(error)
    case EIP1193.UnrecognizedChain:
      throw new errors.ProviderChainNotFoundError(error)
    case EIP1193.Unauthorized:
      throw new errors.ProviderUnauthorized(error)
    case EIP1193.UnsupportedMethod:
      throw new errors.ProviderUnsupportedMethod(error)
    case EIP1193.Disconnected:
      throw new errors.ProviderDisconnected(error)
    case EIP1193.ChainDisconnected:
      throw new errors.ProviderChainDisconnected(error)
    case EIP1474.ParseError:
      throw new errors.ProviderParseError(error)
    case EIP1474.InvalidRequest:
      throw new errors.ProviderInvalidRequest(error)
    case EIP1474.MethodNotFound:
      throw new errors.ProviderMethodNotFound(error)
    case EIP1474.InvalidParams:
      throw new errors.ProviderInvalidParams(error)
    case EIP1474.InternalError:
      throw new errors.ProviderInternalError(error)
    case EIP1474.InvalidInput:
      throw new errors.ProviderInvalidInput(error)
    case EIP1474.ResourceNotFound:
      throw new errors.ProviderResourceNotFound(error)
    case EIP1474.ResourceUnavailable:
      throw new errors.ProviderResourceUnavailable(error)
    case EIP1474.TransactionRejected:
      throw new errors.ProviderTransactionRejected(error)
    case EIP1474.MethodNotSupported:
      throw new errors.ProviderMethodNotSupported(error)
    case EIP1474.LimitExceeded:
      throw new errors.ProviderLimitExceeded(error)
    case EIP1474.JsonRpcVersionNotSupported:
      throw new errors.ProviderJsonRpcVersionNotSupported(error)
    default:
      if (defaultHandlerFn) {
        defaultHandlerFn(error)
      }

      throw error
  }
}

export const wrapExternalEthProvider = (
  provider: providers.ExternalProvider,
  errorHandler?: (error: Error) => unknown,
): EthereumProvider => {
  const stubProvider = provider as EthereumProvider

  const request = async (request: {
    method: string
    params?: Array<unknown>
  }) => {
    let result: unknown

    try {
      result = await provider?.request?.(request)
    } catch (error) {
      handleEthError(error as EthProviderRpcError, errorHandler)
    }

    return result
  }

  return {
    ...(provider as EthereumProvider),
    ...(stubProvider?.once ? { once: stubProvider.once } : {}),
    ...(stubProvider?.on ? { on: stubProvider.on } : {}),
    ...(stubProvider?.off ? { off: stubProvider.off } : {}),
    ...(stubProvider?.addListener
      ? { addListener: stubProvider.addListener }
      : {}),
    ...(stubProvider?.removeListener
      ? { removeListener: stubProvider.removeListener }
      : {}),
    ...(stubProvider?.removeAllListeners
      ? { removeAllListeners: stubProvider.removeAllListeners }
      : {}),
    ...(stubProvider?.providers?.length
      ? {
          providers: stubProvider.providers,
        }
      : {}),
    ...(stubProvider?.selectedAddress
      ? { selectedAddress: stubProvider.selectedAddress }
      : {}),
    request,
  }
}
