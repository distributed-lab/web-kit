import { BN_ASSERT_DECIMALS_OP } from '@/enums'
import { assert } from '@/helpers'

import { BN } from './bn'

export const assertDecimals = (
  currentDecimals: number,
  targetDecimals: number,
  op: BN_ASSERT_DECIMALS_OP,
) => {
  assert(
    targetDecimals < BN.precision,
    'Target decimals cannot be greater than the BN config precision',
  )

  if (op === BN_ASSERT_DECIMALS_OP.GREATER) {
    assert(
      targetDecimals > currentDecimals,
      'Target decimals cannot be less than the current decimals',
    )
    return
  }

  assert(
    targetDecimals < currentDecimals,
    'Target decimals cannot be greater than the current decimals',
  )
}
