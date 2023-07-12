import { HEX_REGEX, NUMBER_REGEX } from '@/const'
import { RuntimeError } from '@/errors'

export const isHex = (value: string): boolean => HEX_REGEX.test(value)

export const isIntegerString = (value: string): boolean => {
  return Boolean(value.match(/^-?\d+$/))
}

export const isFixedPointString = (value: string): boolean => {
  return Boolean(value.match(NUMBER_REGEX))
}

export function assert(
  expression: boolean,
  message: string,
): asserts expression is false {
  if (!expression) throw new RuntimeError(message)
}
