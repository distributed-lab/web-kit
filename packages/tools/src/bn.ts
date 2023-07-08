import { assert } from '@/errors'
import { isHex } from '@/helpers'
import type { BnConfig, BnConfigLike, BnLike, BnStaticConfig } from '@/types'

export const DEFAULT_BN_PRECISION = 18

const ZERO = '0'
const BN_0 = BigInt(ZERO)
const NUMBER_REGEX = /^(-?)(\d*)\.?(\d*)$/

let staticConfig: BnStaticConfig = {
  precision: DEFAULT_BN_PRECISION,
}

export class BN {
  public static MAX_UINT256 = BN.fromBigInt(2n ** 256n - 1n, 1)

  public static get config(): BnStaticConfig {
    return staticConfig
  }

  public static get precision(): number {
    return staticConfig.precision
  }

  readonly #value: bigint
  readonly #cfg: BnConfig
  readonly #tens: bigint = getTens(BN.precision)

  /**
   *
   * @param value - Always BigInt * ten power of ${@link BN.precision}
   * @param config - The config of the value.
   * @protected
   * @returns A new {@link BN} instance.
   */
  protected constructor(value: bigint, config: BnConfig) {
    this.#value = value
    this.#cfg = config
  }

  /**
   * Sets new {@link BnStaticConfig} config to the {@link BN}.
   */
  public static setConfig(config: Partial<BnStaticConfig>): void {
    staticConfig = { ...staticConfig, ...config }
  }
  /**
   *
   * @returns `true` if `arg` is {@link BN} instance.
   */
  public static isBn(arg: unknown): arg is BN {
    return arg instanceof BN
  }

  /**
   * @returns A new {@link BN} if `value` argument is valid big int like value,
   * otherwise throws {@link RuntimeError}.
   */
  public static fromBigInt(value: BnLike, config: BnConfigLike): BN {
    let val = value

    if (typeof val === 'string') {
      val = isHex(val) ? BigInt(val).toString() : val
      assert(!val.match(/^(-?)(\d*)$/), 'Invalid big int string')
    }
    const cfg = parseConfig(config)
    const parsed = BigInt(BN.isBn(val) ? val.value : val)
    const withPrecision = parsed * getTens(BN.precision - cfg.decimals)
    return new BN(withPrecision, cfg)
  }

  /**
   * @returns A new {@link BN} if `value` argument is valid integer or float value,
   * otherwise throws {@link RuntimeError}.
   */
  public static fromRaw(value: string | number, config: BnConfigLike): BN {
    const val = String(value)
    return new BN(BigInt(parseNumberString(val)), parseConfig(config))
  }

  public static min(...args: BN[]): BN {
    const min = args.reduce((min, el) => (el.raw < min.raw ? el : min))
    return new BN(min.raw, min.config)
  }

  public static max(...args: BN[]): BN {
    const max = args.reduce((min, el) => (el.raw > min.raw ? el : min))
    return new BN(max.raw, max.config)
  }

  public get config(): BnConfig {
    return this.#cfg
  }

  /**
   *  @returns The number of decimal places
   */
  public get decimals(): number {
    return this.#cfg.decimals
  }

  /**
   *  @returns `true` if the `this` value is zero.
   */
  public get isZero(): boolean {
    return this.#value === BN_0
  }

  public get isNegative(): boolean {
    return this.#value < BN_0
  }

  /**
   *  @returns A raw {@link BigInt} value with the {@link BN.precision} applied.
   */
  public get raw(): bigint {
    return this.#value
  }

  public get value(): string {
    return toDecimals(this.#value, this.#cfg.decimals, BN.precision).toString()
  }

  /**
   *  @returns A new {@link BN} with the result of this added to `other`.
   */
  public add(other: BN): BN {
    return new BN(this.#value + other.raw, this.#cfg)
  }

  /**
   *  @returns A new {@link BN} with the result of other subtracted from this.
   */
  public sub(other: BN): BN {
    return new BN(this.#value - other.raw, this.#cfg)
  }

  /**
   *  @returns A new {@link BN} with the result of this divided by `other`.
   */
  public div(other: BN): BN {
    assert(other.raw === BN_0, 'Cannot divide by zero')
    return new BN((this.raw * this.#tens) / other.raw, this.#cfg)
  }

  /**
   *  @returns A new {@link BN} with the result of this multiplied by `other`.
   */
  public mul(other: BN): BN {
    return new BN((this.raw * other.raw) / this.#tens, this.#cfg)
  }

  /**
   *  @returns A comparison result between this and other.
   */
  public cmp(other: BN): number {
    const a = this.raw
    const b = other.raw
    if (a < b) return -1
    if (a > b) return 1
    return 0
  }

  /**
   *  @returns `true` if `other` is equal to `this`.
   */
  public eq(other: BN): boolean {
    return this.cmp(other) === 0
  }

  /**
   *  @returns `true` if `other` is less than to `this`.
   */
  public lt(other: BN): boolean {
    return this.cmp(other) < 0
  }

  /**
   *  @returns `true` if `other` is less than or equal to `this`.
   */
  public lte(other: BN): boolean {
    return this.cmp(other) <= 0
  }

  /**
   *  @returns `true` if `other` is greater than to `this`.
   */
  public gt(other: BN): boolean {
    return this.cmp(other) > 0
  }

  /**
   *  @returns `true` if `other` is greater than or equal to `this`.
   */
  public gte(other: BN): boolean {
    return this.cmp(other) >= 0
  }

  /**
   * @returns A new {@link BN} with the provided decimals.
   */
  public toDecimals(decimals: number): BN {
    return decimals > this.#cfg.decimals
      ? this.toGreaterDecimals(decimals)
      : this.toLessDecimals(decimals)
  }

  public toLessDecimals(decimals: number): BN {
    assertDecimals(decimals, this.#cfg.decimals, BN_ASSERT_DECIMALS_OP.LESS)
    return this.#toDecimals(decimals)
  }

  public toGreaterDecimals(decimals: number): BN {
    assertDecimals(decimals, this.#cfg.decimals, BN_ASSERT_DECIMALS_OP.GREATER)
    return this.#toDecimals(decimals)
  }

  #toDecimals(decimals: number): BN {
    return new BN(this.#value, { ...this.#cfg, decimals })
  }

  /**
   * @returns A human-readable float string.
   */
  public toString(): string {
    let val = this.value

    const decimals = this.#cfg.decimals
    const negative = this.isNegative ? '-' : ''
    const isLessOne = val.length < decimals

    if (this.isNegative) val = val.slice(1)

    if (isLessOne) val = val.padStart(decimals, ZERO)

    const pointIdx = val.length - decimals

    val = val.slice(0, pointIdx) + '.' + val.slice(pointIdx)

    if (val.startsWith('.')) val = ZERO + val

    return negative + val
  }
}

enum BN_ASSERT_DECIMALS_OP {
  LESS = 'LESS',
  GREATER = 'GREATER',
}

function assertDecimals(
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

function parseNumberString(_value: string): string {
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

function parseConfig(config: BnConfigLike): BnConfig {
  const cfg = typeof config === 'number' ? { decimals: config } : config
  assert(!cfg.decimals, 'Decimals cannot be zero or undefined')
  assert(cfg.decimals < 0, 'Decimals cannot be negative')
  return cfg
}

function toDecimals(
  val: bigint,
  decimals: number,
  actualDecimals: number,
): bigint {
  return decimals > actualDecimals
    ? toGreaterDecimals(val, decimals, actualDecimals)
    : toLessDecimals(val, decimals, actualDecimals)
}

function toGreaterDecimals(
  val: bigint,
  decimals: number,
  currentDecimals: number,
): bigint {
  assertDecimals(decimals, currentDecimals, BN_ASSERT_DECIMALS_OP.GREATER)
  return val * 10n ** BigInt(decimals - currentDecimals)
}

function toLessDecimals(
  val: bigint,
  decimals: number,
  currentDecimals: number,
): bigint {
  assertDecimals(decimals, currentDecimals, BN_ASSERT_DECIMALS_OP.LESS)
  return val / 10n ** BigInt(currentDecimals - decimals)
}

function getTens(precision: number): bigint {
  return 10n ** BigInt(precision)
}
