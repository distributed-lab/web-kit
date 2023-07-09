import { ZERO } from '@/const'
import { assert } from '@/errors'
import type { BnFormatConfig } from '@/types'

export const format = (value: string, format: BnFormatConfig) => {
  /* eslint-disable prefer-const */
  let {
    prefix = '',
    decimalSeparator = '.',
    groupSeparator = ',',
    groupSize = 3,
    fractionGroupSeparator = ' ',
    fractionGroupSize = 0,
    suffix = '',
    decimals,
  } = format
  /* eslint-enable prefer-const */

  const expression =
    !Number.isInteger(groupSize) || !Number.isInteger(fractionGroupSize)

  assert(expression, 'groupSize and fractionGroupSize must be an integer')

  let [whole, fraction] = value.split('.')

  const negative = whole.startsWith('-') ? '-' : ''

  if (negative) whole = whole.slice(1)

  if (groupSize && groupSeparator) {
    whole = insertCharEveryN(whole, groupSeparator, groupSize)
  }

  if (decimals === 0) {
    fraction = ''
    decimalSeparator = ''
  }

  if (decimals) {
    fraction = fraction.padEnd(decimals, ZERO).slice(0, decimals + 1)
  }

  if (fractionGroupSeparator && fractionGroupSize) {
    fraction = insertCharEveryN(
      fraction,
      fractionGroupSeparator,
      fractionGroupSize,
    )
  }

  return [prefix, negative, whole, decimalSeparator, fraction, suffix].join('')
}

const insertCharEveryN = (value: string, char: string, n: number) => {
  const result = value.split('').reduce((acc, i, idx) => {
    if (idx && !(idx % n)) return acc + char + i
    return acc + i
  }, '')

  return result.endsWith(char) ? result.slice(0, -1) : result
}
