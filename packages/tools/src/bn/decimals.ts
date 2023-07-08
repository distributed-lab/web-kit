import { BN_ASSERT_DECIMALS_OP } from '@/enums'

import { assertDecimals } from './assertions'

export function toDecimals(
  val: bigint,
  decimals: number,
  actualDecimals: number,
): bigint {
  return decimals > actualDecimals
    ? toGreaterDecimals(val, decimals, actualDecimals)
    : toLessDecimals(val, decimals, actualDecimals)
}

export function toGreaterDecimals(
  val: bigint,
  decimals: number,
  currentDecimals: number,
): bigint {
  assertDecimals(decimals, currentDecimals, BN_ASSERT_DECIMALS_OP.GREATER)
  return val * 10n ** BigInt(decimals - currentDecimals)
}

export function toLessDecimals(
  val: bigint,
  decimals: number,
  currentDecimals: number,
): bigint {
  assertDecimals(decimals, currentDecimals, BN_ASSERT_DECIMALS_OP.LESS)
  return val / 10n ** BigInt(currentDecimals - decimals)
}
