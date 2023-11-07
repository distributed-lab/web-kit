import { NUMBER_REGEX } from '@/const'
import { assert, isFixedPointString } from '@/helpers'
import type { BnConfig, BnConfigLike } from '@/types'

import { assertDecimalsInteger } from './assertions'
import { BN } from './bn'

export const parseNumberString = (_value: string): string => {
  let val = _value.trim()

  assert(isFixedPointString(val), 'Invalid fixed point string value')

  while (val.length !== 1 && val[0] === '0' && val[1] !== '.') {
    val = val.substring(1)
  }

  const match = val.match(NUMBER_REGEX)!
  const sign = match[1]
  const whole = sign + match[2]
  const fractional = (match[3] ?? '').replace('.', '').slice(0, BN.precision)
  const isFractionalZero = !fractional || fractional.match(/^(0+)$/)
  const isWholeZero = whole === '0' || whole.replaceAll('0', '') === ''

  const exponential = match[4]
  const exponentialSign = exponential?.slice(1, 2)
  const exponentialDecimals = Number(exponential?.slice(2))

  if (isWholeZero && isFractionalZero) return '0'

  let result = whole.padEnd(whole.length + BN.precision, '0')

  if (!fractional) return fromExp(result, exponentialSign, exponentialDecimals)

  result = (isWholeZero ? '' : whole) + fractional.padEnd(BN.precision, '0')

  return fromExp(result, exponentialSign, exponentialDecimals)
}

const fromExp = (value: string, sign?: string, decimals?: number) => {
  if (!sign || !decimals) return value
  if (sign === '+') return value.padEnd(value.length + decimals, '0')
  if (decimals > value.length) return '0'

  return value.slice(0, value.length - decimals)
}

export const parseConfig = (config: BnConfigLike): BnConfig => {
  const cfg = typeof config === 'number' ? { decimals: config } : config
  assertDecimalsInteger(cfg.decimals)
  assert(Boolean(cfg.decimals), 'Decimals cannot be zero or undefined')
  assert(cfg.decimals > 0, 'Decimals cannot be negative')
  return cfg
}
