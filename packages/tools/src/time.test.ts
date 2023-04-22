import { Time } from './time'

describe('Performs time class unit test', () => {
  test('test add function(time + 1) should return correct value', () => {
    const time = new Time('2023-03-03')
    time.utc(true)
    time.add(1)

    expect(time.toDate().getTime().toString()).toStrictEqual('1677801600001')
  })
  test('test add function(time + 1 min), should return correct value', () => {
    const time = new Time('2023-03-03')
    time.utc(true)
    const plusMin = time.add(1, 'minute')
    expect(plusMin.toDate().getTime().toString()).toStrictEqual('1677801660000')
  })
  test('test validate time, should return wrong value ', () => {
    const time = new Time('wrong input')
    time.utc(true)
    expect(time.isValid).toStrictEqual(false)
  })
  test('test validate time, should return correct value', () => {
    const time = new Time()
    time.utc(true)
    expect(time.isValid).toStrictEqual(true)
  })
  test('test clone time, should return correct value', () => {
    const time1 = new Time()
    time1.utc(true)
    const clone = time1.clone()
    expect(time1.toDate()).toStrictEqual(clone.toDate())
  })
  test('test diff func, should return negative value', () => {
    const time1 = new Time('2023-03-03')
    const time2 = new Time('2023-03-04')
    expect(time1.diff(time2)).toStrictEqual(-86400000)
  })

  test('test diff func, should return positive value', () => {
    const time1 = new Time('2023-03-04')
    const time2 = new Time('2023-03-03')
    expect(time1.diff(time2)).toStrictEqual(86400000)
  })

  test('test timestamp, should return correct value', () => {
    const time = new Time('2023-03-03')
    time.utc(true)
    expect(time.timestamp).toStrictEqual(1677801600)
  })

  test('test isSame, should return correct value', () => {
    const time1 = new Time('2023-03-03')
    const time2 = new Time('2023-03-03')
    expect(time2.isSame(time1.toDate())).toEqual(true)
  })

  test('test isSam func, should return wrong value', () => {
    const time1 = new Time('2023-03-03')
    const time2 = new Time('2023-03-04')
    expect(time2.isSame(time1.toDate())).toEqual(false)
  })

  test('test after func, should return correct value', () => {
    const time1 = new Time('2023-03-03')
    const time2 = new Time('2023-03-04')
    expect(time2.isAfter(time1.toDate())).toEqual(true)
  })

  test('test after func, should return wrong value', () => {
    const time1 = new Time('2023-03-03')
    const time2 = new Time('2023-03-04')
    expect(time1.isAfter(time2.toDate())).toEqual(false)
  })

  test('test before func, should return correct value', () => {
    const time1 = new Time('2023-03-03')
    const time2 = new Time('2023-03-04')
    expect(time1.isBefore(time2.toDate())).toEqual(true)
  })

  test('test before func, should return wrong value', () => {
    const time1 = new Time('2023-03-03')
    const time2 = new Time('2023-03-04')
    expect(time2.isBefore(time1.toDate())).toEqual(false)
  })

  test('test beforeOrSame func, should return correct value', () => {
    const time1 = new Time('2023-03-03')
    const time2 = new Time('2023-03-03')
    expect(time1.isSameOrBefore(time2.toDate())).toEqual(true)
  })

  test('test beforeOrSame func, should return correct value', () => {
    const time1 = new Time('2023-03-03')
    const time2 = new Time('2023-03-04')
    expect(time1.isSameOrBefore(time2.toDate())).toEqual(true)
  })

  test('test beforeOrSame func, should return wrong value', () => {
    const time1 = new Time('2023-03-03')
    const time2 = new Time('2023-03-04')
    expect(time2.isSameOrBefore(time1.toDate())).toEqual(false)
  })

  test('test afterOrSame func, should return correct value', () => {
    const time1 = new Time('2023-03-03')
    const time2 = new Time('2023-03-03')
    expect(time2.isSameOrAfter(time1.toDate())).toEqual(true)
  })

  test('test afterOrSame func, should return correct value', () => {
    const time1 = new Time('2023-03-03')
    const time2 = new Time('2023-03-04')
    expect(time2.isSameOrAfter(time1.toDate())).toEqual(true)
  })

  test('test afterOrSame func, should return wrong value', () => {
    const time1 = new Time('2023-03-03')
    const time2 = new Time('2023-03-04')
    expect(time1.isSameOrAfter(time2.toDate())).toEqual(false)
  })

  test('test between func, should return correct value', () => {
    const time1 = new Time('2023-03-02')
    const time2 = new Time('2023-03-04')
    const timeBetween = new Time('2023-03-03')
    expect(timeBetween.isBetween(time1.toDate(), time2.toDate())).toEqual(true)
  })

  test('test between func, should return wrong value', () => {
    const time1 = new Time('2023-03-02')
    const time2 = new Time('2023-03-04')
    const timeBetween = new Time('2023-06-03')
    expect(timeBetween.isBetween(time1.toDate(), time2.toDate())).toEqual(false)
  })

  test('test RFC3339, should return correct RFC3339', () => {
    const time = new Time('2023-03-03')
    time.utc(true)
    expect(time.RFC3339).toEqual('2023-03-03T00:00:00Z')
  })

  test('test ISO, should return should correct ISO', () => {
    const time = new Time('2023-03-03')
    time.utc(true)
    expect(time.ISO).toEqual('2023-03-03T00:00:00.000Z')
  })

  test('test subtract func, should return correct value', () => {
    const time = new Time('2023-03-03')
    time.utc(true)
    const subTime = time.subtract(1, 'day')
    expect(subTime.toDate().getTime()).toStrictEqual(1677715200000)
  })

  test('test  ms, should return correct value', () => {
    const time = new Time('2023-03-03')
    time.utc(true)
    expect(time.ms).toStrictEqual(1677801600000)
  })
})
