import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

import { Duration } from './duration'
dayjs.extend(duration)
describe('duration testing', () => {
  test('as days', () => {
    const dr = new Duration({ days: 2 })
    expect(dr.asDays).toStrictEqual(2)
  })

  test('days', () => {
    const dr = new Duration({ days: 2 })
    expect(dr.days).toStrictEqual(2)
  })

  test('minutes', () => {
    const dr = new Duration({ minutes: 2 })
    expect(dr.minutes).toStrictEqual(2)
  })

  test('as minutes', () => {
    const dr = new Duration({ days: 2 })
    expect(dr.asMinutes).toStrictEqual(2880)
  })

  test('seconds', () => {
    const dr = new Duration({ seconds: 2 })
    expect(dr.seconds.toString()).toStrictEqual('2')
  })

  test('as seconds', () => {
    const dr = new Duration({ days: 2 })
    expect(dr.asSeconds).toStrictEqual(172800)
  })

  test('milliseconds', () => {
    const dr = new Duration({ milliseconds: 2 })
    expect(dr.milliseconds).toStrictEqual(2)
  })

  test('as milliseconds', () => {
    const dr = new Duration({ days: 2 })
    expect(dr.asMilliseconds).toStrictEqual(172800000)
  })

  test('months', () => {
    const dr = new Duration({ months: 2 })
    expect(dr.months).toStrictEqual(2)
  })

  test('as months', () => {
    const dr = new Duration({ days: 2 })
    expect(dr.asMonths).toStrictEqual(0.06666666666666667)
  })

  test('hours', () => {
    const dr = new Duration({ hours: 2 })
    expect(dr.hours).toStrictEqual(2)
  })

  test('as hours', () => {
    const dr = new Duration({ days: 2 })
    expect(dr.asHours).toStrictEqual(48)
  })

  test('weeks', () => {
    const dr = new Duration({ weeks: 2 })
    expect(dr.weeks).toStrictEqual(2)
  })

  test('as weeks', () => {
    const dr = new Duration({ days: 2 })
    expect(dr.asWeeks).toStrictEqual(0.2857142857142857)
  })
})
