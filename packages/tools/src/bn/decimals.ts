import { BN_ASSERT_DECIMALS_OP } from '@/enums'

import { assertDecimals } from './assertions'

export const toDecimals = (
  val: bigint,
  currentDecimals: number,
  targetDecimals: number,
): bigint => {
  return targetDecimals > currentDecimals
    ? toGreaterDecimals(val, currentDecimals, targetDecimals)
    : toLessDecimals(val, currentDecimals, targetDecimals)
}

export const toGreaterDecimals = (
  val: bigint,
  currentDecimals: number,
  targetDecimals: number,
): bigint => {
  assertDecimals(currentDecimals, targetDecimals, BN_ASSERT_DECIMALS_OP.GREATER)
  return val * 10n ** BigInt(targetDecimals - currentDecimals)
}

export const toLessDecimals = (
  val: bigint,
  currentDecimals: number,
  targetDecimals: number,
): bigint => {
  assertDecimals(currentDecimals, targetDecimals, BN_ASSERT_DECIMALS_OP.LESS)
  return val / 10n ** BigInt(currentDecimals - targetDecimals)
}

export const getTens = (precision: number): bigint => {
  return 10n ** BigInt(precision)
}
