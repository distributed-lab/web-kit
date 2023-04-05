import BigNumber from 'bignumber.js'

import { DECIMALS } from '@/enums'
import { BN_ROUNDING } from '@/enums'
import { BnCfg, BnFormatCfg, BnLike } from '@/types'

BigNumber.config({
  DECIMAL_PLACES: 0,
  ROUNDING_MODE: BN_ROUNDING.DEFAULT,
  FORMAT: {
    decimalSeparator: '.',
    groupSeparator: ',',
    groupSize: 3,
  },
  EXPONENTIAL_AT: 256,
})

export class BN {
  readonly #bn: BigNumber
  readonly #cfg: BnCfg

  public static ROUNDING = BN_ROUNDING
  public static WEI_DECIMALS = DECIMALS.WEI
  public static MAX_UINT256 = BN.fromBigInt(
    BN.#instance(2).pow(256).minus(1),
    1,
  )
  // 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff

  protected constructor(bigLike: BnLike, cfg: BnCfg) {
    if (!cfg.decimals || cfg.decimals < 0) {
      throw new TypeError(
        `Decimals must be greater than 0, ${JSON.stringify({
          number: bigLike,
          cfg,
        })}`,
      )
    }

    const finalCfg = {
      decimals: cfg.decimals,
      rounding: cfg.rounding || BN_ROUNDING.DEFAULT,
      noGroupSeparator: cfg.noGroupSeparator ?? true,
    } as BnCfg

    this.#bn = BN.#instance(bigLike, finalCfg)
    this.#cfg = finalCfg
  }

  /**
   * @description @link{BN.fromBigInt} accepts uint number value
   * @example
   * ```ts
   * const oneEth = BN.fromBigInt('1000000000000000000', 18)
   * ```
   */
  public static fromBigInt(
    bigLike: BnLike,
    decimals: number,
    cfg = {} as BnCfg,
  ): BN {
    return new BN(bigLike, {
      ...cfg,
      ...({ decimals } as BnCfg),
    })
  }

  /**
   * @description @link{BN.fromRaw} accepts number value and multiply it to 10**decimals
   * @example
   * ```ts
   * const oneEth = BN.fromBigInt(1, 18)
   * ```
   */
  public static fromRaw(
    bigLike: BnLike,
    decimals: number,
    cfg = {} as BnCfg,
  ): BN {
    return new BN(bigLike, {
      ...cfg,
      ...({ decimals } as BnCfg),
    }).toFraction(decimals)
  }

  public static isBn(arg: unknown): arg is BN {
    return arg instanceof BN
  }

  static #getGreatestDecimal(...args: BN[]): BN {
    return args.find(
      el => el.decimals === Math.max(...args.map(el => el.decimals)),
    )!
  }

  static #toGreatestDecimals(...args: BN[]): BN[] {
    const greatestDecimals = BN.#getGreatestDecimal(...args).decimals

    return args.map(el =>
      BN.fromBigInt(
        el.bn.multipliedBy(BN.#makeTenPower(greatestDecimals - el.decimals)),
        greatestDecimals,
      ),
    )
  }

  static #makeTenPower(decimals: BnLike): BigNumber {
    return BN.#instance(10).pow(BN.isBn(decimals) ? decimals.bn : decimals)
  }

  static #makeOneTenthPower(decimals: BnLike): BigNumber {
    return BN.#instance(0.1).pow(BN.isBn(decimals) ? decimals.bn : decimals)
  }

  static #instance(value: BnLike, config?: BnCfg): BigNumber {
    let ctor = BigNumber
    if (config) {
      ctor = ctor.clone()
      ctor.config({
        ...('decimals' in config ? { DECIMAL_PLACES: config.decimals } : {}),
        ...('rounding' in config ? { ROUNDING_MODE: config.rounding } : {}),
      })
    }

    if (BigNumber.isBigNumber(value)) return value
    if (BN.isBn(value)) return value.#bn

    try {
      return new ctor(value)
    } catch (error) {
      throw new TypeError(`Cannot convert the given "${value}" to BN!`)
    }
  }

  public static min(...args: BN[]): BN {
    return new BN(
      BigNumber.minimum(...BN.#toGreatestDecimals(...args).map(el => el.#bn)),
      {
        decimals: BN.#getGreatestDecimal(...args).decimals,
      },
    )
  }

  public static max(...args: BN[]): BN {
    return new BN(
      BigNumber.maximum(...BN.#toGreatestDecimals(...args).map(el => el.#bn)),
      {
        decimals: BN.#getGreatestDecimal(...args).decimals,
      },
    )
  }

  public get cfg(): BnCfg {
    return this.#cfg
  }

  public get decimals(): number {
    return this.#cfg.decimals
  }

  public get bn(): BigNumber {
    return this.#bn
  }

  public get isZero(): boolean {
    return this.#bn.isZero()
  }

  public get value(): string {
    return this.#bn.toFormat({
      groupSeparator: '',
      decimalSeparator: '.',
      fractionGroupSeparator: '',
    })
  }

  public clone(cfg?: BnCfg): BN {
    return new BN(this.value, { ...this.#cfg, ...(cfg || {}) })
  }

  public mul(other: BN): BN {
    const greatestDecimals = BN.#getGreatestDecimal(this, other).decimals
    const [numA, numB] = BN.#toGreatestDecimals(this, other)

    return new BN(
      numA.bn
        .multipliedBy(numB.bn)
        .dividedBy(BN.#makeTenPower(greatestDecimals))
        .toFixed(0), // Remove decimal part after dividing on power of ten
      {
        ...this.#cfg,
        decimals: greatestDecimals,
      },
    )
  }

  public div(other: BN): BN {
    if (other.isZero) {
      throw new TypeError(`Cannot divide ${other.value} by zero`)
    }

    const greatestDecimals = BN.#getGreatestDecimal(this, other).decimals
    const [numA, numB] = BN.#toGreatestDecimals(this, other)

    return new BN(
      numA.bn
        .dividedBy(numB.bn)
        .multipliedBy(BN.#makeTenPower(greatestDecimals))
        .toFixed(0), // Remove decimal part after multiplying on power of ten
      {
        ...this.#cfg,
        decimals: greatestDecimals,
      },
    )
  }

  public add(other: BN): BN {
    const [numA, numB] = BN.#toGreatestDecimals(this, other)

    return new BN(numA.bn.plus(numB.bn), {
      ...this.#cfg,
      decimals: BN.#getGreatestDecimal(this, other).decimals,
    })
  }

  public sub(other: BN): BN {
    const [numA, numB] = BN.#toGreatestDecimals(this, other)

    return new BN(numA.bn.minus(numB.bn), {
      ...this.#cfg,
      decimals: BN.#getGreatestDecimal(this, other).decimals,
    })
  }

  public pow(other: number): BN {
    const bn = BN.#instance
    const fr = BN.#makeTenPower(
      bn(this.#cfg.decimals).multipliedBy(bn(other - 1)),
    )

    return new BN(this.#bn.pow(bn(other)).dividedBy(fr), this.#cfg)
  }

  public sqrt(): BN {
    if (this.#cfg.decimals > 1 && this.#cfg.decimals % 2 !== 0) {
      throw new TypeError(
        `SQRT requires decimals to be even number, ${JSON.stringify({
          number: this.#bn,
          decimals: this.#cfg.decimals,
        })}`,
      )
    }

    const bn = BN.#instance
    const fr = BN.#makeTenPower(bn(this.#cfg.decimals / 2))

    return new BN(this.#bn.sqrt().multipliedBy(fr), this.#cfg)
  }

  public isGreaterThan(other: BN): boolean {
    return this.#bn.isGreaterThan(other.bn)
  }

  public isGreaterThanOrEqualTo(other: BN): boolean {
    return this.#bn.isGreaterThanOrEqualTo(other.bn)
  }

  public isLessThan(other: BN): boolean {
    return this.#bn.isLessThan(other.bn)
  }

  public isLessThanOrEqualTo(other: BN): boolean {
    return this.#bn.isLessThanOrEqualTo(other.bn)
  }

  public isEqualTo(other: BN): boolean {
    return this.#bn.isEqualTo(other.bn)
  }

  public round(precision: number, mode?: BN_ROUNDING): string {
    return this.#bn.toPrecision(precision, mode)
  }

  public format(format?: BnFormatCfg): string {
    try {
      const {
        decimals = BigNumber.config({}).DECIMAL_PLACES as number,
        rounding = BigNumber.config({}).ROUNDING_MODE as BN_ROUNDING,
        noGroupSeparator,
        ...fmt
      } = format || ({} as BnFormatCfg)

      return this.#bn.toFormat(decimals, rounding, {
        ...BigNumber.config({}).FORMAT,
        ...fmt,
        groupSeparator: noGroupSeparator ? '' : fmt?.groupSeparator ?? '',
      })
    } catch (error) {
      throw new TypeError(
        `Cannot format the given "${this.value}" with config ${JSON.stringify(
          format,
        )}!${
          error instanceof Error ? `: ${error.message ?? error.toString()}` : ''
        }`,
      )
    }
  }

  public toFraction(decimals?: number): BN {
    const fr = BN.#makeTenPower(decimals || DECIMALS.WEI)
    return new BN(this.#bn.multipliedBy(fr), this.#cfg)
  }

  public fromFraction(decimals?: number): BN {
    const fr = BN.#makeOneTenthPower(decimals || DECIMALS.WEI)
    return new BN(this.#bn.multipliedBy(fr), this.#cfg)
  }

  /**
   * @description Converts uint value to float and returns human-readable string
   */
  public toString(): string {
    return this.clone().fromFraction(this.decimals).#bn.toFormat({
      groupSeparator: '',
      decimalSeparator: '.',
      fractionGroupSeparator: '',
    })
  }
}
