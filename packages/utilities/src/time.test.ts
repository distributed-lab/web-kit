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
})
