import { BN_ZERO, DEFAULT_BN_PRECISION, HUNDRED, ONE, ZERO } from '@/const'
import { BN_ASSERT_DECIMALS_OP } from '@/enums'
import { assert } from '@/errors'
import { isHex } from '@/helpers'
import type { BnConfig, BnConfigLike, BnGlobalConfig, BnLike } from '@/types'

import { assertDecimals } from './assertions'
import { getTens, toDecimals } from './decimals'
import { parseConfig, parseNumberString } from './parsers'

let globalConfig: BnGlobalConfig = {
  precision: DEFAULT_BN_PRECISION,
}

export class BN {
  /**
   * Solidity maximum uint256 value.
   */
  public static MAX_UINT256 = BN.fromBigInt(2n ** 256n - 1n, 1)

  /**
   * {@link BN} class global config.
   */
  public static get config(): BnGlobalConfig {
    return globalConfig
  }

  /**
   * {@link BN} class global precision.
   */
  public static get precision(): number {
    return globalConfig.precision
  }

  /**
   * Raw value multiplied by ten power of {@link BN.precision}.
   */
  readonly #raw: bigint

  /**
   * {@link BN} instance config.
   */
  readonly #cfg: BnConfig

  /**
   * Ten power of {@link BN.precision}.
   */
  readonly #tens: bigint = getTens(BN.precision)

  /**
   *
   * @param value - Always BigInt * ten power of {@link BN.precision}
   * @param config - The config of the value.
   * @protected
   * @returns A new {@link BN} instance.
   */
  protected constructor(value: bigint, config: BnConfig) {
    this.#raw = value
    this.#cfg = config
  }

  /**
   * Sets new {@link BnGlobalConfig} config to the {@link BN}.
   */
  public static setConfig(config: Partial<BnGlobalConfig>): void {
    globalConfig = { ...globalConfig, ...config }
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
  public static fromBigInt(value: BnLike, decimalsOrConfig: BnConfigLike): BN {
    let val = value

    if (typeof val === 'string') {
      val = isHex(val) ? BigInt(val).toString() : val
      assert(!val.match(/^(-?)(\d*)$/), 'Invalid big int string')
    }
    const cfg = parseConfig(decimalsOrConfig)
    const parsed = BigInt(BN.isBn(val) ? val.value : val)
    const withPrecision = parsed * getTens(BN.precision - cfg.decimals)
    return new BN(withPrecision, cfg)
  }

  /**
   * @returns A new {@link BN} if `value` argument is valid integer or float value,
   * otherwise throws {@link RuntimeError}.
   */
  public static fromRaw(
    value: Exclude<BnLike, BN>,
    decimalsOrConfig: BnConfigLike,
  ): BN {
    const val = String(value)
    return new BN(BigInt(parseNumberString(val)), parseConfig(decimalsOrConfig))
  }

  /**
   *  @returns A minimum {@link BN} value from the `args`.
   */
  public static min(...args: BN[]): BN {
    const min = args.reduce((min, el) => (el.raw < min.raw ? el : min))
    return new BN(min.raw, min.config)
  }

  /**
   *  @returns A maximum {@link BN} value from the `args`.
   */
  public static max(...args: BN[]): BN {
    const max = args.reduce((min, el) => (el.raw > min.raw ? el : min))
    return new BN(max.raw, max.config)
  }

  /**
   *  @returns A `this` config.
   */
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
    return this.#raw === BN_ZERO
  }

  /**
   *  @returns `true` if the `this` value is positive.
   */
  public get isPositive(): boolean {
    return this.#raw > BN_ZERO
  }

  /**
   *  @returns `true` if the `this` value is negative.
   */
  public get isNegative(): boolean {
    return this.#raw < BN_ZERO
  }

  /**
   *  @returns A raw {@link BigInt} value with the {@link BN.precision} applied.
   */
  public get raw(): bigint {
    return this.#raw
  }

  /**
   *  @returns A big int string value with the `this.decimals` applied.
   */
  public get value(): string {
    return toDecimals(this.#raw, this.#cfg.decimals, BN.precision).toString()
  }

  /**
   *  @returns A new {@link BN} with the result of this added to `other`.
   */
  public add(other: BN): BN {
    return new BN(this.#raw + other.raw, this.#cfg)
  }

  /**
   *  @returns A new {@link BN} with the result of other subtracted from this.
   */
  public sub(other: BN): BN {
    return new BN(this.#raw - other.raw, this.#cfg)
  }

  /**
   *  @returns A new {@link BN} with the result of this divided by `other`.
   */
  public div(other: BN): BN {
    assert(other.raw === BN_ZERO, 'Cannot divide by zero')
    return new BN((this.#raw * this.#tens) / other.raw, this.#cfg)
  }

  /**
   *  @returns A new {@link BN} with the result of this multiplied by `other`.
   */
  public mul(other: BN): BN {
    return new BN((this.#raw * other.raw) / this.#tens, this.#cfg)
  }

  /**
   *  @returns A comparison result between this and other.
   */
  public cmp(other: BN): number {
    const a = this.#raw
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

  public sqrt(): BN {
    const expression = BN.precision > 1 && BN.precision % 2 !== 0
    assert(expression, 'sqrt requires precision to be even number')

    if (this.isZero) return this

    let x0 = this.raw / 2n
    let x1 = (x0 + this.raw / x0) / 2n

    while (x0 - x1 > 1n) {
      x0 = x1
      x1 = (x0 + this.raw / x0) / 2n
    }

    return new BN(x1 * getTens(BN.precision / 2), this.#cfg)
  }

  /**
   * @returns A new {@link BN} whose value is negated `this` (multiplied by -1).
   */
  public negated(): BN {
    return new BN(this.#raw * -1n, this.#cfg)
  }

  /**
   * @returns A new {@link BN} whose value is absolute `this`.
   */
  public abs(): BN {
    return this.isPositive ? this : this.negated()
  }

  /**
   * @returns A new {@link BN} whose value is `this` raised to the power of `exponent`.
   */
  public pow(exponent: number): BN {
    const exp = BigInt(exponent)
    const fr = getTens(Number(BigInt(BN.precision) * (exp - 1n)))
    return new BN(this.#raw ** exp / fr, this.#cfg)
  }

  /**
   * @returns A new {@link BN} whose value is percentage of `this` value.
   */
  public percent(percent: number): BN {
    return this.mul(this.#percentToFraction(percent))
  }

  /**
   * @returns A new {@link BN} whose value is `this` with added percentage.
   */
  public addPercent(percent: number): BN {
    return this.mul(this.#one.add(this.#percentToFraction(percent)))
  }

  /**
   * @returns A new {@link BN} whose value is `this` with subtracted percentage.
   */
  public subPercent(percent: number): BN {
    return this.div(this.#one.add(this.#percentToFraction(percent)))
  }

  /**
   * @returns A new {@link BN} with the provided decimals.
   */
  public toDecimals(decimals: number): BN {
    return decimals > this.#cfg.decimals
      ? this.toGreaterDecimals(decimals)
      : this.toLessDecimals(decimals)
  }

  /**
   * @returns A new {@link BN} with the provided decimals, less than current one,
   * otherwise throws {@link RuntimeError}.
   */
  public toLessDecimals(decimals: number): BN {
    assertDecimals(decimals, this.#cfg.decimals, BN_ASSERT_DECIMALS_OP.LESS)
    return this.#toDecimals(decimals)
  }

  /**
   * @returns A new {@link BN} with the provided decimals, greater than current one,
   * otherwise throws {@link RuntimeError}.
   */
  public toGreaterDecimals(decimals: number): BN {
    assertDecimals(decimals, this.#cfg.decimals, BN_ASSERT_DECIMALS_OP.GREATER)
    return this.#toDecimals(decimals)
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

  /**
   * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#description}
   */
  public toJSON(): string {
    return this.value
  }

  get #one(): BN {
    return BN.fromRaw(ONE, this.config)
  }

  get #hundred(): BN {
    return BN.fromRaw(HUNDRED, this.config)
  }

  #toDecimals(decimals: number): BN {
    return new BN(this.#raw, { ...this.#cfg, decimals })
  }

  #percentToFraction(percent: number): BN {
    return BN.fromRaw(percent, this.config).div(this.#hundred)
  }
}
