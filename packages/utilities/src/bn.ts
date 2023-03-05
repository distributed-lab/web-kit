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
      throw new Error(
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

  static fromFraction(
    bigLike: BnLike,
    decimals: number,
    cfg = {} as BnCfg,
  ): BN {
    return new BN(bigLike, {
      ...cfg,
      ...({ decimals } as BnCfg),
    })
  }

  static fromRaw(bigLike: BnLike, decimals: number, cfg = {} as BnCfg): BN {
    return new BN(bigLike, {
      ...cfg,
      ...({ decimals } as BnCfg),
    }).toFraction(decimals)
  }

  static isBn(arg: unknown): arg is BN {
    return arg instanceof BN
  }

  static getBiggestDecimal(...args: BN[]): BN {
    return args.find(
      el => el.cfg.decimals === Math.max(...args.map(el => el.cfg.decimals)),
    )!
  }

  static normalizeDecimals(...args: BN[]): BN[] {
    const numWithBiggestDecimals = BN.getBiggestDecimal(...args)

    return args.map(el =>
      BN.fromFraction(
        el!.bn.multipliedBy(
          BN.#instance(10).pow(
            numWithBiggestDecimals!.cfg.decimals - el.cfg.decimals,
          ),
        ),
        numWithBiggestDecimals!.cfg.decimals,
      ),
    )
  }

  static min(...args: BN[]): BN {
    const numWithBiggestDecimals = BN.getBiggestDecimal(...args)

    return new BN(
      BigNumber.minimum(...BN.normalizeDecimals(...args).map(el => el.#bn)),
      {
        decimals: numWithBiggestDecimals.cfg.decimals,
      },
    )
  }

  static max(...args: BN[]): BN {
    const numWithBiggestDecimals = BN.getBiggestDecimal(...args)

    return new BN(
      BigNumber.maximum(...BN.normalizeDecimals(...args).map(el => el.#bn)),
      {
        decimals: numWithBiggestDecimals.cfg.decimals,
      },
    )
  }

  mul(other: BN): BN {
    const numWithBiggestDecimals = BN.getBiggestDecimal(this, other)
    const [numA, numB] = BN.normalizeDecimals(this, other)

    return new BN(
      numA.bn
        .multipliedBy(numB.bn)
        .dividedBy(BN.#instance(10).pow(numWithBiggestDecimals.cfg.decimals)),
      {
        ...this.#cfg,
        decimals: numWithBiggestDecimals.cfg.decimals,
      },
    )
  }

  div(other: BN): BN {
    if (other.bn.isZero()) throw new Error('Division by zero')

    const numWithBiggestDecimals = BN.getBiggestDecimal(this, other)
    const [numA, numB] = BN.normalizeDecimals(this, other)

    return new BN(numA.bn.dividedBy(numB.bn), {
      ...this.#cfg,
      decimals: numWithBiggestDecimals.cfg.decimals,
    })
  }

  add(other: BN): BN {
    const numWithBiggestDecimals = BN.getBiggestDecimal(this, other)
    const [numA, numB] = BN.normalizeDecimals(this, other)

    return new BN(numA.bn.plus(numB.bn), {
      ...this.#cfg,
      decimals: numWithBiggestDecimals.cfg.decimals,
    })
  }

  sub(other: BN): BN {
    const numWithBiggestDecimals = BN.getBiggestDecimal(this, other)
    const [numA, numB] = BN.normalizeDecimals(this, other)

    return new BN(numA.bn.minus(numB.bn), {
      ...this.#cfg,
      decimals: numWithBiggestDecimals.cfg.decimals,
    })
  }

  pow(other: number): BN {
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

  /**
   * this > other => 1;
   * this < other => -1;
   * this === other => 0;
   *
   * @param {BnLike} other
   * @returns {number}
   */
  compare(other: BN): number {
    const [numA, numB] = BN.normalizeDecimals(this, other)

    return numA.bn.comparedTo(numB.bn)
  }

  round(precision: number, mode?: BN_ROUNDING): string {
    return this.#bn.toPrecision(precision, mode)
  }

  format(format?: BnFormatCfg): string {
    try {
      const {
        decimals = BigNumber.config({}).DECIMAL_PLACES as number,
        rounding = BigNumber.config({}).ROUNDING_MODE as BN_ROUNDING,
        noGroupSeparator,
        ...fmt
      } = format || {}
      const groupSeparatorFormat: { [key: string]: string | number } = {
        ...('groupSeparator' in fmt && fmt.groupSeparator
          ? { groupSeparator: fmt.groupSeparator as string }
          : {}),
      }
      if (noGroupSeparator) {
        groupSeparatorFormat.groupSeparator = ''
      }

      return this.#bn.toFormat(decimals, rounding, {
        ...BigNumber.config({}).FORMAT,
        ...fmt,
        ...groupSeparatorFormat,
      } as BigNumber.Format)
    } catch (error) {
      console.error(error)
      return '—'
    }
  }

  toFraction(decimals?: number): BN {
    const fr = decimals
      ? BN.#instance(10).pow(decimals)
      : BN.#instance(10).pow(WEI_DECIMALS)

    return new BN(this.#bn.multipliedBy(fr), this.#cfg)
  }

  fromFraction(decimals?: number): BN {
    const fr = decimals
      ? BN.#instance(0.1).pow(decimals)
      : BN.#instance(0.1).pow(WEI_DECIMALS)

    return new BN(this.#bn.multipliedBy(fr), this.#cfg)
  }

  toString(): string {
    return this.#bn.toFormat({
      groupSeparator: '',
      decimalSeparator: '.',
      fractionGroupSeparator: '',
    })
  }

  toJSON(): string {
    return this.toString()
  }

  valueOf(): string {
    return this.toString()
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

  get cfg(): BnCfg {
    return this.#cfg
  }

  get bn(): BigNumber {
    return this.#bn
  }
}
