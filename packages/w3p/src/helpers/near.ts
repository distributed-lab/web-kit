import { utils } from 'near-api-js'

import { EIP1193, EIP1474 } from '@/enums'
import { errors } from '@/errors'
import { NearRawProvider } from '@/providers'
import { Chain, NearProviderRpcError } from '@/types'

export const MAX_GAS_LIMIT = '300000000000000'
export const NO_DEPOSIT = '0'

// Export for typedoc
export { NearRawProvider }

export const nearProviderBase = new NearRawProvider({})

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
    case EIP1193.userRejectedRequest:
      throw new errors.ProviderUserRejectedRequest()
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
