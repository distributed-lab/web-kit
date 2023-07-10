import { BN_ASSERT_DECIMALS_OP } from '@/enums'
import { assert } from '@/helpers'

import { BN } from './bn'

export const assertDecimals = (
  decimals: number,
  currentDecimals: number,
  op: BN_ASSERT_DECIMALS_OP,
) => {
  assert(
    decimals > BN.precision,
    'Provided decimals cannot be greater than the BN config precision',
  )

  const isGreater = op === BN_ASSERT_DECIMALS_OP.GREATER

  const expression = isGreater
    ? decimals < currentDecimals
    : decimals > currentDecimals

  const message = isGreater
    ? 'Provided decimals cannot be less than the current decimals'
    : 'Provided decimals cannot be greater than the current decimals'

  assert(expression, message)
}
