// import {  } from './types'

import { Time } from './time'
describe('time testing', () => {
  test('test constructor with params', () => {
    const time = new Time('2023-03-03')
    time.format('YYYY-MM-DD')
    expect(time.toDate().getTime().toString()).toStrictEqual('1677794400000')
  })
  test('test add function(time + 1)', () => {
    const time = new Time('2023-03-03')
    time.add(1)
    expect(time.toDate().getTime().toString()).toStrictEqual('1677794400001')
  })
  test('test add function(time + 1 min)', () => {
    const time = new Time('2023-03-03')
    const plusMin = time.add(1, 'minute')
    expect(plusMin.toDate().getTime().toString()).toStrictEqual('1677794460000')
  })
  test('test validate time', () => {
    const time = new Time('wresf')
    expect(time.isValid).toStrictEqual(false)
  })
  test('test validate time', () => {
    const time = new Time('2023-03-03')
    expect(time.isValid).toStrictEqual(true)
  })
  test('test clone time', () => {
    const time = new Time('2023-03-03')
    const clone = time.clone()
    expect(time.toDate()).toStrictEqual(clone.toDate())
  })
  test('test diff func', () => {
    const time = new Time('2023-03-03')
    const secondTime = new Time('2023-03-04')
    expect(time.diff(secondTime)).toStrictEqual(-86400000)
  })

  test('test diff func', () => {
    const time = new Time('2023-03-04')
    const secondTime = new Time('2023-03-03')
    expect(time.diff(secondTime)).toStrictEqual(86400000)
  })

  test('test timestamp', () => {
    const time = new Time('2023-03-03')
    expect(time.timestamp).toStrictEqual(1677794400)
  })

  test('test isSame', () => {
    const time1 = new Time('2023-03-03')
    const time2 = new Time('2023-03-03')
    expect(time2.isSame(time1.toDate())).toEqual(true)
  })

  test('test isSam func (return false)', () => {
    const time1 = new Time('2023-03-03')
    const time2 = new Time('2023-03-04')
    expect(time2.isSame(time1.toDate())).toEqual(false)
  })

  test('test after func', () => {
    const time1 = new Time('2023-03-03')
    const time2 = new Time('2023-03-04')
    expect(time2.isAfter(time1.toDate())).toEqual(true)
  })

  test('test after func(false)', () => {
    const time1 = new Time('2023-03-03')
    const time2 = new Time('2023-03-04')
    expect(time1.isAfter(time2.toDate())).toEqual(false)
  })

  test('test before func', () => {
    const time1 = new Time('2023-03-03')
    const time2 = new Time('2023-03-04')
    expect(time1.isBefore(time2.toDate())).toEqual(true)
  })

  test('test before func(false)', () => {
    const time1 = new Time('2023-03-03')
    const time2 = new Time('2023-03-04')
    expect(time2.isBefore(time1.toDate())).toEqual(false)
  })

  test('test beforeOrSame func', () => {
    const time1 = new Time('2023-03-03')
    const time2 = new Time('2023-03-03')
    expect(time1.isSameOrBefore(time2.toDate())).toEqual(true)
  })

  test('test beforeOrSame func', () => {
    const time1 = new Time('2023-03-03')
    const time2 = new Time('2023-03-04')
    expect(time1.isSameOrBefore(time2.toDate())).toEqual(true)
  })

  test('test beforeOrSame func(false)', () => {
    const time1 = new Time('2023-03-03')
    const time2 = new Time('2023-03-04')
    expect(time2.isSameOrBefore(time1.toDate())).toEqual(false)
  })

  test('test afterOrSame func(same)', () => {
    const time1 = new Time('2023-03-03')
    const time2 = new Time('2023-03-03')
    expect(time2.isSameOrAfter(time1.toDate())).toEqual(true)
  })

  test('test afterOrSame func', () => {
    const time1 = new Time('2023-03-03')
    const time2 = new Time('2023-03-04')
    expect(time2.isSameOrAfter(time1.toDate())).toEqual(true)
  })

  test('test afterOrSame func(false)', () => {
    const time1 = new Time('2023-03-03')
    const time2 = new Time('2023-03-04')
    expect(time1.isSameOrAfter(time2.toDate())).toEqual(false)
  })

  test('test between func', () => {
    const time1 = new Time('2023-03-02')
    const time2 = new Time('2023-03-04')
    const timeBetween = new Time('2023-03-03')
    expect(timeBetween.isBetween(time1.toDate(), time2.toDate())).toEqual(true)
  })

  test('test between func(false)', () => {
    const time1 = new Time('2023-03-02')
    const time2 = new Time('2023-03-04')
    const timeBetween = new Time('2023-03-03')
    expect(timeBetween.isBetween(time1.toDate(), time2.toDate())).toEqual(true)
  })

  test('test RFC3339', () => {
    const time1 = new Time('2023-03-03')
    expect(time1.RFC3339).toEqual('2023-03-03T00:00:00Z')
  })

  test('test ISO', () => {
    const time1 = new Time('2023-03-03')
    expect(time1.ISO).toEqual('2023-03-02T22:00:00.000Z')
  })

  test('test subtract func', () => {
    const time1 = new Time('2023-03-03')
    const subTime = time1.subtract(1, 'day')
    expect(subTime.toDate().getTime()).toStrictEqual(1677708000000)
  })

  test('test  ms', () => {
    const time1 = new Time('2023-03-03')
    expect(time1.ms).toStrictEqual(1677794400000)
  })
})
