import { setJsonApiHeaders } from './set-json-api-headers'

describe('setJsonapiHeaders', () => {
  it('should set proper set of headers', () => {
    const headers = setJsonApiHeaders({ headers: {} })

    expect(headers).toStrictEqual({
      'Content-Type': 'application/vnd.api+json',
      Accept: 'application/vnd.api+json',
    })
  })
})
