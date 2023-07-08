import { NUMBER_REGEX, ZERO } from '@/const'
import { assert } from '@/errors'
import type { BnConfig, BnConfigLike } from '@/types'

import { BN } from './bn'

export function parseNumberString(_value: string): string {
  let val = _value.trimStart().trimEnd()

  assert(!val.match(new RegExp(NUMBER_REGEX)), 'Invalid string value')

  while (val[0] === ZERO && val[1] !== '.') {
    val = val.substring(1)
  }

  const match = val.match(new RegExp(NUMBER_REGEX))!
  const negative = match[1]
  const whole = negative + match[2]
  const fractional = match[3].slice(0, BN.precision)
  const isFractionalZero = !fractional || fractional.match(/^(0+)$/)
  const isWholeZero = whole === ZERO || whole.replaceAll(ZERO, '') === ''

  if (isWholeZero && isFractionalZero) return ZERO
  if (!fractional) return whole.padEnd(whole.length + BN.precision, ZERO)

  return (isWholeZero ? '' : whole) + fractional.padEnd(BN.precision, ZERO)
}

export function parseConfig(config: BnConfigLike): BnConfig {
  const cfg = typeof config === 'number' ? { decimals: config } : config
  assert(!cfg.decimals, 'Decimals cannot be zero or undefined')
  assert(cfg.decimals < 0, 'Decimals cannot be negative')
  return cfg
}
