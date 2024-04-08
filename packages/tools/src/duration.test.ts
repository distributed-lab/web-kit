import { Duration } from './duration'

describe('Performs duration class unit test', () => {
  test('asDays should return correct value', () => {
    const dr = new Duration({ days: 2 })
    expect(dr.asDays).toStrictEqual(2)
  })

  test('days should return correct value', () => {
    const dr = new Duration({ days: 2 })
    expect(dr.days).toStrictEqual(2)
  })

  test('minutes should return correct value', () => {
    const dr = new Duration({ minutes: 2 })
    expect(dr.minutes).toStrictEqual(2)
  })

  test('asMinutes should return correct value', () => {
    const dr = new Duration({ days: 2 })
    expect(dr.asMinutes).toStrictEqual(2880)
  })

  test('seconds should return correct value', () => {
    const dr = new Duration({ seconds: 2 })
    expect(dr.seconds.toString()).toStrictEqual('2')
  })

  test('as seconds should return correct value', () => {
    const dr = new Duration({ days: 2 })
    expect(dr.asSeconds).toStrictEqual(172800)
  })

  test('milliseconds should return correct value', () => {
    const dr = new Duration({ milliseconds: 2 })
    expect(dr.milliseconds).toStrictEqual(2)
  })

  test('as milliseconds should return correct value', () => {
    const dr = new Duration({ days: 2 })
    expect(dr.asMilliseconds).toStrictEqual(172800000)
  })

  test('months should return correct value', () => {
    const dr = new Duration({ months: 2 })
    expect(dr.months).toStrictEqual(2)
  })

  test('as months should return correct value', () => {
    const dr = new Duration({ days: 2 })
    expect(dr.asMonths).toBeLessThanOrEqual(0.06666666666666667)
  })

  test('hours should return correct value', () => {
    const dr = new Duration({ hours: 2 })
    expect(dr.hours).toStrictEqual(2)
  })

  test('as hours should return correct value', () => {
    const dr = new Duration({ days: 2 })
    expect(dr.asHours).toStrictEqual(48)
  })

  test('weeks should return correct value', () => {
    const dr = new Duration({ weeks: 2 })
    expect(dr.weeks).toStrictEqual(2)
  })

  test('as weeks should return correct value', () => {
    const dr = new Duration({ days: 2 })
    expect(dr.asWeeks).toStrictEqual(0.2857142857142857)
  })
})
