import { BN } from '@/bn/bn'

export type BnConfigLike = number | BnConfig

export type BnConfig = {
  decimals: number
}

export type BnLike = string | number | bigint | BN

export type BnGlobalConfig = {
  precision: number
}
