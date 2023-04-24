import { type providers, utils } from 'ethers'

import { EIP1193, EIP1474 } from '@/enums'
import { errors } from '@/errors'
import type { Chain, ChainId, EthProviderRpcError } from '@/types'

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
  chainId: number,
  chainName: string,
  chainRpcUrl: string,
): Promise<void> => {
  await provider.send('wallet_addEthereumChain', [
    {
      chainId: utils.hexValue(chainId),
      chainName,
      rpcUrls: [chainRpcUrl],
    },
  ])
}

export const connectEthAccounts = async (provider: providers.Web3Provider) => {
  await provider.send('eth_requestAccounts', [])
}

export function handleEthError(error: EthProviderRpcError): void {
  switch (error.code) {
    case EIP1193.UserRejectedRequest:
      throw new errors.ProviderUserRejectedRequest()
    case EIP1193.UnrecognizedChain:
      throw new errors.ProviderChainNotFoundError()
    case EIP1193.Unauthorized:
      throw new errors.ProviderUnauthorized()
    case EIP1193.UnsupportedMethod:
      throw new errors.ProviderUnsupportedMethod()
    case EIP1193.Disconnected:
      throw new errors.ProviderDisconnected()
    case EIP1193.ChainDisconnected:
      throw new errors.ProviderChainDisconnected()
    case EIP1474.ParseError:
      throw new errors.ProviderParseError()
    case EIP1474.InvalidRequest:
      throw new errors.ProviderInvalidRequest()
    case EIP1474.MethodNotFound:
      throw new errors.ProviderMethodNotFound()
    case EIP1474.InvalidParams:
      throw new errors.ProviderInvalidParams()
    case EIP1474.InternalError:
      throw new errors.ProviderInternalError()
    case EIP1474.InvalidInput:
      throw new errors.ProviderInvalidInput()
    case EIP1474.ResourceNotFound:
      throw new errors.ProviderResourceNotFound()
    case EIP1474.ResourceUnavailable:
      throw new errors.ProviderResourceUnavailable()
    case EIP1474.TransactionRejected:
      throw new errors.ProviderTransactionRejected()
    case EIP1474.MethodNotSupported:
      throw new errors.ProviderMethodNotSupported()
    case EIP1474.LimitExceeded:
      throw new errors.ProviderLimitExceeded()
    case EIP1474.JsonRpcVersionNotSupported:
      throw new errors.ProviderJsonRpcVersionNotSupported()
    default:
      throw error
  }
}
