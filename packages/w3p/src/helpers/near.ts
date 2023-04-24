import { utils } from 'near-api-js'

import { EIP1193, EIP1474 } from '@/enums'
import { errors } from '@/errors'
import type { Chain, NearProviderRpcError } from '@/types'

export const MAX_GAS_LIMIT = '300000000000000'
export const NO_DEPOSIT = '0'

export const nearToYocto = (amount: string): string | null => {
  return utils.format.parseNearAmount(amount)
}

export const yoctoToNear = (amount: string): string | null => {
  return utils.format.formatNearAmount(amount)
}

export function getNearExplorerTxUrl(
  explorerUrl: string | Chain,
  txHash: string,
): string {
  return `${explorerUrl}/transactions/${txHash}`
}

export function getNearExplorerAddressUrl(
  explorerUrl: string | Chain,
  address: string,
): string {
  return `${explorerUrl}/accounts/${address}`
}

export function handleNearError(error: NearProviderRpcError): never {
  switch (error.code) {
    case EIP1193.UserRejectedRequest:
      throw new errors.ProviderUserRejectedRequest()
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
