import { DECIMALS } from '@/enums'

export const DEFAULT_BN_PRECISION = DECIMALS.YOCTO
export const ONE = '1'
export const ZERO = '0'
export const HUNDRED = '100'
export const BN_ZERO = BigInt(ZERO)
export const NUMBER_REGEX = /^(-?)(\d*)\.?(\d*)$/
