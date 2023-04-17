import { JsonApiClientRequestQuery } from '@/types'

import { flatJsonApiQuery } from './flat-json-api-query'

describe('flatJsonApiQuery', () => {
  it('should not modify object with primitive query parameters', () => {
    const query = {
      foo: 'bar',
      fizz: 'buzz',
    }

    const params = flatJsonApiQuery(query)

    expect(params).toStrictEqual(query)
  })

  it('should properly modify object with array params', () => {
    const query = {
      param: ['fizz', 'bar', 'buzz'],
      param2: ['abc', 123, 'qqq'],
    }

    const params = flatJsonApiQuery(query)

    expect(params).toStrictEqual({
      param: 'fizz,bar,buzz',
      param2: 'abc,123,qqq',
    })
  })

  it('should properly modify object with object params', () => {
    const query = {
      filter: {
        first_name: 'John',
        min_age: 25,
      },
      page: {
        number: 2,
        limit: 15,
      },
    }

    const params = flatJsonApiQuery(query)

    expect(params).toStrictEqual({
      'filter[first_name]': 'John',
      'filter[min_age]': 25,
      'page[number]': 2,
      'page[limit]': 15,
    })
  })

  it('should throw the proper error when query has nested array param', () => {
    const query = {
      param: [1, 2, [3, 4]],
    } as JsonApiClientRequestQuery

    expect(() => flatJsonApiQuery(query)).toThrow(
      'Nested arrays or objects are not allowed for using in query params',
    )
  })

  it('should throw the proper error when query has nested object param', () => {
    const query = {
      param: {
        nestedParam: {
          key: 'value',
        },
      },
    } as unknown as JsonApiClientRequestQuery

    expect(() => flatJsonApiQuery(query)).toThrow(
      'Nested arrays or objects are not allowed for using in query params',
    )
  })
})
