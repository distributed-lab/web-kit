import { assert } from '@/helpers'
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
    Number.isInteger(groupSize) && Number.isInteger(fractionGroupSize)

  assert(expression, 'groupSize and fractionGroupSize must be an integer')

  let [whole, fraction] = value.split('.')

  const sign = whole.startsWith('-') ? '-' : ''

  if (sign) whole = whole.slice(1)

  if (groupSize && groupSeparator) {
    whole = insertCharEveryN(whole, groupSeparator, groupSize)
  }

  if (decimals) {
    fraction = fraction.padEnd(decimals, '0').slice(0, decimals + 1)
  } else {
    fraction = ''
    decimalSeparator = ''
  }

  if (fractionGroupSeparator && fractionGroupSize) {
    fraction = insertCharEveryN(
      fraction,
      fractionGroupSeparator,
      fractionGroupSize,
    )
  }

  return [prefix, sign, whole, decimalSeparator, fraction, suffix].join('')
}

const insertCharEveryN = (value: string, char: string, n: number) => {
  const val = value.endsWith(char) ? value.slice(0, -1) : value
  const result = val.replace(new RegExp(`(.{${n}})`, 'g'), `$1${char}`)
  return result.endsWith(char) ? result.slice(0, -1) : result
}
