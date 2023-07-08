import { BN_ASSERT_DECIMALS_OP } from '@/enums'
import { assert } from '@/errors'

import { BN } from './bn'

export function assertDecimals(
  decimals: number,
  currentDecimals: number,
  op: BN_ASSERT_DECIMALS_OP,
): void {
  assert(
    decimals > BN.precision,
    'Provided decimals cannot be greater than the precision',
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
