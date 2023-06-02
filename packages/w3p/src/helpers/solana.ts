import { Transaction } from '@solana/web3.js'
import bs58 from 'bs58'

import { EIP1193, EIP1474, SOLANA_CHAINS } from '@/enums'
import { errors } from '@/errors'
import type { Chain, SolanaProviderRpcError } from '@/types'

export function handleSolError(error: SolanaProviderRpcError): never {
  const ErrorCode = error?.error?.code || error?.code

  switch (ErrorCode) {
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

export function decodeSolanaTx(tx: string) {
  const buff = bs58.decode(tx)
  return Transaction.from(buff)
}

export function getSolExplorerTxUrl(chain: Chain, txHash: string) {
  const url = `${chain.explorerUrl}/tx/${txHash}`
  return chain.id === SOLANA_CHAINS.MainNet ? url : `${url}?cluster=${chain.id}`
}

export function getSolExplorerAddressUrl(chain: Chain, address: string) {
  const url = `${chain.explorerUrl}/address/${address}`
  return chain.id === SOLANA_CHAINS.MainNet ? url : `${url}?cluster=${chain.id}`
}
