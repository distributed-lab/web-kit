import type { CHAIN_TYPES } from '@/enums'

export type ChainId = string | number

export type Chain = {
  id: ChainId
  name: string
  rpcUrl: string
  explorerUrl: string
  token: {
    name: string
    symbol: string
    decimals: number
  }
  type: CHAIN_TYPES
  icon: string
}
