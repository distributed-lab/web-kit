import { BN } from '@/bn'
import { BN_ROUNDING } from '@/enums'

export type BnConfigLike = number | BnConfig

export type BnConfig = {
  decimals: number
}

export type BnLike = string | number | bigint | BN

export type BnGlobalConfig = {
  precision: number
  decimals: number
  rounding: BN_ROUNDING
  format: BnFormatConfig
}

export type BnFormatConfig = {
  // string to prepend
  prefix?: string
  decimalSeparator?: string
  // grouping separator of the integer part
  groupSeparator?: string
  // primary grouping size of the integer part
  groupSize?: number
  // grouping separator of the fraction part
  fractionGroupSeparator?: string
  // grouping size of the fraction part
  fractionGroupSize?: number
  // string to append
  suffix?: string
  // number of decimals to display
  decimals?: number
}
