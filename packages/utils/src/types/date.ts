export type IsoDate = string // RFC3999Nano ISO Date String
export type UnixDate = number // Unix time
export type StringDate = string // Date in string format
export type InclusivityType = '()' | '[)' | '(]' | '[]' // Inclusivity
export type DurationUnits = Partial<{
  milliseconds: number
  seconds: number
  minutes: number
  hours: number
  days: number
  months: number
  years: number
  weeks: number
}>
export type CalendarType = Partial<{
  sameDay: string
  lastDay: string
  nextDay: string
  lastWeek: string
  nextWeek: string
  sameElse: string
}>
