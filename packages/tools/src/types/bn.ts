import { BN } from '@/bn/bn'

export type BnConfigLike = number | BnConfig

export type BnConfig = {
  decimals: number
}

export type BnLike = string | number | bigint | BN

export type BnGlobalConfig = {
  precision: number
  format: BnFormatConfig
}

export type BnFormatConfig = {
  // string to prepend
  prefix?: string
  // decimal separator
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
