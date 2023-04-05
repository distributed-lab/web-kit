import { setJsonApiHeaders } from './set-json-api-headers'

describe('setJsonapiHeaders', () => {
  test('should set proper set of headers', () => {
    const headers = setJsonApiHeaders({})

    expect(headers).toStrictEqual({
      'Content-Type': 'application/vnd.api+json',
      Accept: 'application/vnd.api+json',
    })
  })
})
