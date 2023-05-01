import { setJsonApiHeaders } from './set-json-api-headers'

describe('setJsonapiHeaders', () => {
  test('should set proper set of headers', () => {
    const headers = setJsonApiHeaders({})

    expect(headers).toStrictEqual({
      'Content-Type': 'application/vnd.api+json',
      Accept: 'application/vnd.api+json',
    })
  })

  test('should set proper set of headers (overriding existing defaults)', () => {
    const headers = setJsonApiHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    })

    expect(headers).toStrictEqual({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    })
  })
})
