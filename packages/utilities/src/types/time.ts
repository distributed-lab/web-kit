import { Dayjs } from 'dayjs'

export type IsoDate = string // RFC3339Nano ISO Date String

export type UnixDate = number // Unix time

export type Inclusivity = '()' | '[)' | '(]' | '[]' // Inclusivity

export type TimeDate = string | number | Date | Dayjs | null | undefined

export type TimeFormat =
  | {
      locale?: string
      format?: string
      utc?: boolean
    }
  | string
  | string[]

export type TimeUnitShort = 'd' | 'D' | 'M' | 'y' | 'h' | 'm' | 's' | 'ms'

export type TimeUnitLong =
  | 'millisecond'
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'month'
  | 'year'
  | 'date'

export type TimeUnitLongPlural =
  | 'milliseconds'
  | 'seconds'
  | 'minutes'
  | 'hours'
  | 'days'
  | 'months'
  | 'years'
  | 'dates'

export type TimeUnit = TimeUnitLong | TimeUnitLongPlural | TimeUnitShort

export type TimeOpUnit = TimeUnit | 'week' | 'weeks' | 'w'

export type TimeManipulate = Exclude<TimeOpUnit, 'date' | 'dates'>

export type TimeCalendar = Partial<{
  sameDay: string
  lastDay: string
  nextDay: string
  lastWeek: string
  nextWeek: string
  sameElse: string
}>

export type TimeLocale = Partial<{
  name: string
  weekdays: string[]
  weekdaysShort: string[]
  weekdaysMin: string[]
  weekStart: number
  yearStart: number
  months: string[]
  monthsShort: string[]
  ordinal: (n: number) => string
  formats: {
    LTS: string
    LT: string
    L: string
    LL: string
    LLL: string
    LLLL: string
    l: string
    ll: string
    lll: string
    llll: string
  }
  relativeTime: {
    future: string
    past: string
    s: string
    m: string
    mm: string
    h: string
    hh: string
    d: string
    dd: string
    M: string
    MM: string
    y: string
    yy: string
  }
  meridiem: (hour?: number, minute?: number, isLowercase?: boolean) => string
  calendar: TimeCalendar
}>

export type DurationUnitsObject = Partial<{
  [unit in Exclude<TimeUnitLongPlural, 'dates'> | 'weeks']: number
}>

export type DurationUnitType = Exclude<TimeUnit, 'date' | 'dates'>
