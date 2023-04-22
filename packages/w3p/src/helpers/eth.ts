import { ethers, type providers } from 'ethers'

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
    { chainId: ethers.utils.hexValue(chainId) },
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
      chainId: ethers.utils.hexValue(chainId),
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
    case EIP1193.userRejectedRequest:
      throw new errors.ProviderUserRejectedRequest()
    case EIP1193.unrecognizedChain:
      throw new errors.ProviderChainNotFoundError()
    case EIP1193.unauthorized:
      throw new errors.ProviderUnauthorized()
    case EIP1193.unsupportedMethod:
      throw new errors.ProviderUnsupportedMethod()
    case EIP1193.disconnected:
      throw new errors.ProviderDisconnected()
    case EIP1193.chainDisconnected:
      throw new errors.ProviderChainDisconnected()
    case EIP1474.parseError:
      throw new errors.ProviderParseError()
    case EIP1474.invalidRequest:
      throw new errors.ProviderInvalidRequest()
    case EIP1474.methodNotFound:
      throw new errors.ProviderMethodNotFound()
    case EIP1474.invalidParams:
      throw new errors.ProviderInvalidParams()
    case EIP1474.internalError:
      throw new errors.ProviderInternalError()
    case EIP1474.invalidInput:
      throw new errors.ProviderInvalidInput()
    case EIP1474.resourceNotFound:
      throw new errors.ProviderResourceNotFound()
    case EIP1474.resourceUnavailable:
      throw new errors.ProviderResourceUnavailable()
    case EIP1474.transactionRejected:
      throw new errors.ProviderTransactionRejected()
    case EIP1474.methodNotSupported:
      throw new errors.ProviderMethodNotSupported()
    case EIP1474.limitExceeded:
      throw new errors.ProviderLimitExceeded()
    case EIP1474.jsonRpcVersionNotSupported:
      throw new errors.ProviderJsonRpcVersionNotSupported()
    default:
      throw error
  }
}
