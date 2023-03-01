import { flattenToAxiosJsonApiQuery } from './flatten-to-axios-json-api-query'
import { JsonApiClientRequestConfig } from '../types'

describe('flattenToAxiosJsonApiQuery', () => {
  it('should not modify object with primitive query parameters', () => {
    const query = {
      foo: 'bar',
      fizz: 'buzz',
    }

    const params = flattenToAxiosJsonApiQuery({
      params: query,
    } as JsonApiClientRequestConfig)

    expect(params).toStrictEqual(query)
  })

  it('should properly modify object with array params', () => {
    const query = {
      param: ['fizz', 'bar', 'buzz'],
      param2: ['abc', 123, 'qqq'],
    }

    const params = flattenToAxiosJsonApiQuery({
      params: query,
    } as JsonApiClientRequestConfig)

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

    const params = flattenToAxiosJsonApiQuery({
      params: query,
    } as JsonApiClientRequestConfig)

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
    }

    expect(() =>
      flattenToAxiosJsonApiQuery({
        params: query,
      } as JsonApiClientRequestConfig),
    ).toThrow(
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
    }

    expect(() =>
      flattenToAxiosJsonApiQuery({
        params: query,
      } as JsonApiClientRequestConfig),
    ).toThrow(
      'Nested arrays or objects are not allowed for using in query params',
    )
  })
})
