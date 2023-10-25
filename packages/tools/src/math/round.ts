import { BN_ROUNDING } from '@/enums'

import { BN } from './bn'
import { toDecimals } from './decimals'

export const round = (bn: BN, decimals: number, mode: BN_ROUNDING) => {
  const precisioned = toDecimals(bn.raw, BN.precision, decimals + 1).toString()

  const isNegative = bn.isNegative
  const num = BigInt(precisioned.slice(0, -1))
  const remainder = BigInt(precisioned.slice(-1))
  const sign = isNegative ? -1n : 1n
  const absNum = sign * num

  switch (mode) {
    case BN_ROUNDING.UP:
      return roundUp(sign, absNum, remainder)
    case BN_ROUNDING.DOWN:
      return roundDown(sign, absNum)
    case BN_ROUNDING.CEIL:
      if (isNegative) return roundDown(sign, absNum)
      return roundUp(sign, absNum, remainder)
    case BN_ROUNDING.FLOOR:
      if (isNegative) return roundUp(sign, absNum, remainder)
      return roundDown(sign, absNum)
    case BN_ROUNDING.HALF_UP:
      return roundHalfUp(sign, absNum, remainder)
    case BN_ROUNDING.HALF_DOWN:
      return roundHalfDown(sign, absNum, remainder)
    case BN_ROUNDING.HALF_CEIL:
      if (isNegative) return roundHalfDown(sign, absNum, remainder)
      return roundHalfUp(sign, absNum, remainder)
    case BN_ROUNDING.HALF_FLOOR:
      if (isNegative) return roundHalfUp(sign, absNum, remainder)
      return roundHalfDown(sign, absNum, remainder)
    default:
      throw new Error('Invalid rounding mode')
  }
}

const roundUp = (sign: bigint, absNum: bigint, remainder: bigint) => {
  return sign * (remainder > 0n ? absNum + 1n : absNum)
}

const roundDown = (sign: bigint, absNum: bigint) => {
  return sign * absNum
}

const roundHalfUp = (sign: bigint, absNum: bigint, remainder: bigint) => {
  return sign * (remainder >= 5n ? absNum + 1n : absNum)
}

const roundHalfDown = (sign: bigint, absNum: bigint, remainder: bigint) => {
  return sign * (remainder > 5n ? absNum + 1n : absNum)
}
