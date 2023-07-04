import dayjs, { Dayjs } from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import duration from 'dayjs/plugin/duration'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import updateLocale from 'dayjs/plugin/updateLocale'
import utc from 'dayjs/plugin/utc'

import type {
  Inclusivity,
  IsoDate,
  TimeCalendar,
  TimeDate,
  TimeFormat,
  TimeLocale,
  TimeManipulate,
  TimeOpUnit,
  TimeUnit,
  UnixDate,
} from '@/types'

dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
dayjs.extend(relativeTime)
dayjs.extend(isBetween)
dayjs.extend(calendar)
dayjs.extend(utc)
dayjs.extend(customParseFormat)
dayjs.extend(updateLocale)
dayjs.extend(timezone)
dayjs.extend(duration)

export class Time {
  #date: Dayjs

  constructor(date?: TimeDate, format?: TimeFormat) {
    this.#date = this._dayjs(date, format)
  }

  public static locale(
    preset?: string | ILocale,
    object?: Partial<ILocale>,
    isLocal?: boolean,
  ): string {
    return dayjs.locale(preset, object, isLocal)
  }

  public static setDefaultTimezone(timezone?: string): void {
    dayjs.tz.setDefault(timezone)
  }

  public static setLocale(
    localeName: string,
    customConfig: TimeLocale,
  ): TimeLocale {
    return dayjs.updateLocale(localeName, customConfig)
  }

  private _dayjs(date?: TimeDate, format?: TimeFormat): Dayjs {
    return dayjs(unwrap(date), format)
  }

  private _tz(date: TimeDate, timezone?: string) {
    return dayjs.tz(unwrap(date), timezone)
  }

  public get dayjs(): Dayjs {
    return this.#date
  }

  public tz(timezone?: string): Time {
    this.#date = this._tz(this.#date, timezone)
    return this
  }

  public utc(keepLocalTime?: boolean): Time {
    this.#date = this.#date.utc(keepLocalTime)
    return this
  }

  public get isValid(): boolean {
    return this.#date.isValid()
  }

  public clone(): Time {
    return new Time(this.#date.clone())
  }

  public get timestamp(): UnixDate {
    return this.#date.unix()
  }

  public get ms(): number {
    return this.#date.valueOf()
  }

  public get ISO(): IsoDate {
    return this.#date.toISOString()
  }

  public get RFC3339(): IsoDate {
    return this.#date.utc(true).format('YYYY-MM-DDTHH:mm:ss[Z]')
  }

  public get(unit: TimeUnit): number {
    return this.#date.get(unit)
  }

  public getAsObject(unit: TimeUnit[]): {
    [K in (typeof unit)[number]]: number
  } {
    return unit.reduce(
      (acc, item) => {
        acc[item] = this.get(item)

        return acc
      },
      {} as {
        [K in (typeof unit)[number]]: number
      },
    )
  }

  public add(value: number, unit?: TimeManipulate): Time {
    this.#date = this.#date.add(value, unit)
    return this
  }

  public format(format?: string): IsoDate {
    return this.#date.format(format)
  }

  public toDate(): Date {
    return this.#date.toDate()
  }

  public toCalendar(referenceTime?: TimeDate, calendar?: TimeCalendar): string {
    return this.#date.calendar(unwrap(referenceTime), calendar)
  }

  public subtract(value: number, unit?: TimeManipulate): Time {
    this.#date = this.#date.subtract(value, unit)
    return this
  }

  public startOf(unit: TimeOpUnit): Time {
    this.#date = this.#date.startOf(unit)
    return this
  }

  public isSame(comparisonDate?: TimeDate, unit?: TimeOpUnit): boolean {
    return this.#date.isSame(unwrap(comparisonDate), unit)
  }

  public isBefore(comparisonDate?: TimeDate): boolean {
    return this.#date.isBefore(unwrap(comparisonDate))
  }

  public isAfter(comparisonDate?: TimeDate): boolean {
    return this.#date.isAfter(unwrap(comparisonDate))
  }

  public isSameOrAfter(comparisonDate?: TimeDate): boolean {
    return this.#date.isSameOrAfter(unwrap(comparisonDate))
  }

  public isSameOrBefore(comparisonDate?: TimeDate): boolean {
    return this.#date.isSameOrBefore(unwrap(comparisonDate))
  }

  public isBetween(
    startDate?: TimeDate,
    endDate?: TimeDate,
    unit?: TimeManipulate,
    inclusivity?: Inclusivity,
  ): boolean {
    return this.#date.isBetween(
      unwrap(startDate),
      unwrap(endDate),
      unit,
      inclusivity,
    )
  }

  public diff(
    comparisonDate: Time,
    unit?: TimeUnit,
    isTruncated = false,
  ): number {
    return this.#date.diff(comparisonDate.dayjs, unit, isTruncated)
  }

  public getFrom(date: TimeDate): string {
    return this.#date.from(unwrap(date))
  }

  public get fromNow(): string {
    return this.#date.fromNow()
  }

  public getTo(date: TimeDate): string {
    return this.#date.to(unwrap(date))
  }

  public get toNow(): string {
    return this.#date.toNow()
  }
}

const unwrap = (date: TimeDate): Exclude<TimeDate, Time> => {
  return date instanceof Time ? date.dayjs : date
}

export const time = (date?: TimeDate, format?: TimeFormat): Time =>
  new Time(date, format)
