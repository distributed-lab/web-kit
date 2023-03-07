import BigNumber from 'bignumber.js'

const WEI_DECIMALS = 18

export enum BN_ROUNDING {
  DEFAULT = 3,
  UP = 0,
  DOWN = 1,
  CEIL = 2,
  FLOOR = 3,
  HALF_UP = 4,
  HALF_DOWN = 5,
  HALF_EVEN = 6,
  HALF_CEIL = 7,
  HALF_FLOOR = 8,
}

export interface BnCfg {
  decimals: number
  rounding?: BN_ROUNDING
  noGroupSeparator?: boolean
}

export type BnFormatCfg = BigNumber.Format & BnCfg
export type BnLike = string | number | BigNumber | BN

BigNumber.config({
  DECIMAL_PLACES: 0,
  ROUNDING_MODE: BN_ROUNDING.DEFAULT,
  FORMAT: {
    decimalSeparator: '.',
    groupSeparator: ',',
    groupSize: 3,
  },
})

export class BN {
  #bn: BigNumber
  #cfg: BnCfg

  static ROUNDING = BN_ROUNDING
  static MAX_UINT256 = BN.#instance(1).pow(256).minus(1)

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
      noGroupSeparator: cfg.noGroupSeparator || true,
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
      el => el.cfg.decimals === Math.max(...args.map(el => el.cfg.decimals)),
    )!
  }

  static #toGreatestDecimals(...args: BN[]): BN[] {
    const numWithGreatestDecimals = BN.#getGreatestDecimal(...args)

    return args.map(el =>
      BN.fromBigInt(
        el!.bn.multipliedBy(
          BN.#instance(10).pow(
            numWithGreatestDecimals!.cfg.decimals - el.cfg.decimals,
          ),
        ),
        numWithGreatestDecimals!.cfg.decimals,
      ),
    )
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

    if (BigNumber.isBigNumber(value)) {
      return value
    }

    if (value instanceof BN) {
      return value.#bn
    }

    try {
      return new ctor(value)
    } catch (error) {
      throw new TypeError(`Cannot convert the given "${value}" to BN!`)
    }
  }

  public static min(...args: BN[]): BN {
    const numWithGreatestDecimals = BN.#getGreatestDecimal(...args)

    return new BN(
      BigNumber.minimum(...BN.#toGreatestDecimals(...args).map(el => el.#bn)),
      {
        decimals: numWithGreatestDecimals.cfg.decimals,
      },
    )
  }

  public static max(...args: BN[]): BN {
    const numWithGreatestDecimals = BN.#getGreatestDecimal(...args)

    return new BN(
      BigNumber.maximum(...BN.#toGreatestDecimals(...args).map(el => el.#bn)),
      {
        decimals: numWithGreatestDecimals.cfg.decimals,
      },
    )
  }

  public get cfg(): BnCfg {
    return this.#cfg
  }

  public get bn(): BigNumber {
    return this.#bn
  }

  public get isZero(): boolean {
    return this.#bn.isZero()
  }

  public mul(other: BN): BN {
    const numWithGreatestDecimals = BN.#getGreatestDecimal(this, other)
    const [numA, numB] = BN.#toGreatestDecimals(this, other)

    return new BN(
      numA.bn
        .multipliedBy(numB.bn)
        .dividedBy(BN.#instance(10).pow(numWithGreatestDecimals.cfg.decimals)),
      {
        ...this.#cfg,
        decimals: numWithGreatestDecimals.cfg.decimals,
      },
    )
  }

  public div(other: BN): BN {
    if (other.bn.isZero())
      throw new TypeError(`Cannot divide ${other.valueOf()} by zero`)

    const numWithGreatestDecimals = BN.#getGreatestDecimal(this, other)
    const [numA, numB] = BN.#toGreatestDecimals(this, other)

    return new BN(numA.bn.dividedBy(numB.bn), {
      ...this.#cfg,
      decimals: numWithGreatestDecimals.cfg.decimals,
    })
  }

  public add(other: BN): BN {
    const numWithGreatestDecimals = BN.#getGreatestDecimal(this, other)
    const [numA, numB] = BN.#toGreatestDecimals(this, other)

    return new BN(numA.bn.plus(numB.bn), {
      ...this.#cfg,
      decimals: numWithGreatestDecimals.cfg.decimals,
    })
  }

  public sub(other: BN): BN {
    const numWithGreatestDecimals = BN.#getGreatestDecimal(this, other)
    const [numA, numB] = BN.#toGreatestDecimals(this, other)

    return new BN(numA.bn.minus(numB.bn), {
      ...this.#cfg,
      decimals: numWithGreatestDecimals.cfg.decimals,
    })
  }

  public pow(other: number): BN {
    return new BN(
      this.#bn
        .pow(BN.#instance(other))
        .dividedBy(
          BN.#instance(10).pow(
            BN.#instance(this.#cfg.decimals).multipliedBy(
              BN.#instance(other - 1),
            ),
          ),
        ),
      this.#cfg,
    )
  }

  public isGreaterThan(other: BN): boolean {
    return this.#compare(other) === 1
  }

  public isGreaterThanOrEqualTo(other: BN): boolean {
    return this.#compare(other) >= 0
  }

  public isLessThan(other: BN): boolean {
    return this.#compare(other) === -1
  }

  public isLessThanOrEqualTo(other: BN): boolean {
    return this.#compare(other) <= 0
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
      } = format || {}
      const groupSeparatorFormat: { [key: string]: string | number } = {
        groupSeparator: noGroupSeparator
          ? ''
          : (fmt as BigNumber.Format)?.groupSeparator ?? '',
      }

      return this.#bn.toFormat(decimals, rounding, {
        ...BigNumber.config({}).FORMAT,
        ...fmt,
        ...groupSeparatorFormat,
      } as BigNumber.Format)
    } catch (error) {
      throw new TypeError(
        `Cannot format the given "${this.valueOf()}" with config ${JSON.stringify(
          format,
        )}!${
          error instanceof Error ? `: ${error.message ?? error.toString()}` : ''
        }`,
      )
    }
  }

  public toFraction(decimals?: number): BN {
    const fr = decimals
      ? BN.#instance(10).pow(decimals)
      : BN.#instance(10).pow(WEI_DECIMALS)

    return new BN(this.#bn.multipliedBy(fr), this.#cfg)
  }

  public fromFraction(decimals?: number): BN {
    const fr = decimals
      ? BN.#instance(0.1).pow(decimals)
      : BN.#instance(0.1).pow(WEI_DECIMALS)

    return new BN(this.#bn.multipliedBy(fr), this.#cfg)
  }

  public toString(): string {
    return this.#bn.toFormat({
      groupSeparator: '',
      decimalSeparator: '.',
      fractionGroupSeparator: '',
    })
  }

  public toJSON(): string {
    return this.toString()
  }

  public valueOf(): string {
    return this.toString()
  }

  /**
   * this > other => 1;
   * this < other => -1;
   * this === other => 0;
   *
   * @param {BnLike} other
   * @returns {number}
   */
  #compare(other: BN): number {
    const [numA, numB] = BN.#toGreatestDecimals(this, other)

    return numA.bn.comparedTo(numB.bn)
  }
}
