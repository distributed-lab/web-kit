import BigNumber from 'bignumber.js'

import { BN } from '@/bn'
import { BN_ROUNDING } from '@/enums'

export type BnCfg = {
  decimals: number
  rounding?: BN_ROUNDING
  noGroupSeparator?: boolean
}

export type BnFormatCfg = BigNumber.Format & BnCfg
export type BnLike = string | number | BigNumber | BN
