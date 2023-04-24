import type { FetcherAbortManager } from '@/abort-manager'
import { DEFAULT_CONFIG } from '@/const'
import type { HTTP_METHODS } from '@/enums'
import type { FetcherConfig, FetcherRequestConfig } from '@/types'

import { buildRequestConfig, buildRequestURL } from './request'

const CFG: FetcherConfig = {
  ...DEFAULT_CONFIG,
  baseUrl: 'https://example.com',
  headers: {
    'Content-Type': 'application/json',
  },
}

const REQUEST_CFG: FetcherRequestConfig = {
  id: '1',
  method: 'GET' as HTTP_METHODS,
  endpoint: '/api/v1/users',
  headers: {
    Connection: 'keep-alive',
  },
}

const ABORT_MANAGER = {
  setSafe: jest.fn(),
} as unknown as FetcherAbortManager

const RESULT = {
  body: null,
  cache: 'no-store',
  credentials: 'include',
  method: 'GET',
  referrerPolicy: 'strict-origin-when-cross-origin',
  signal: ABORT_MANAGER.setSafe(REQUEST_CFG.id),
  headers: {
    'Content-Type': 'application/json',
    Connection: 'keep-alive',
  },
}

describe('performs buildRequest unit test', () => {
  describe('performs buildRequestConfig', () => {
    test('should return valid RequestInit object', () => {
      expect(buildRequestConfig(CFG, REQUEST_CFG, ABORT_MANAGER)).toEqual(
        RESULT,
      )
    })

    test('should return valid RequestInit object with body', () => {
      const body = {
        name: 'John Doe',
      }
      const request = {
        ...REQUEST_CFG,
        body,
      }

      const result = {
        ...RESULT,
        body: JSON.stringify(body),
      }
      expect(buildRequestConfig(CFG, request, ABORT_MANAGER)).toEqual(result)
    })
  })

  describe('performs buildRequestURL', () => {
    test('should return valid URL', () => {
      const baseUrl = 'https://example.com'
      const endpoint = '/api/v1/users'
      const url = 'https://example.com/api/v1/users'
      expect(buildRequestURL(baseUrl, endpoint)).toEqual(url)
    })

    test('should handle double slashes', () => {
      const baseUrl = 'https://example.com/'
      const endpoint = '/api/v1/users'
      const url = 'https://example.com/api/v1/users'
      expect(buildRequestURL(baseUrl, endpoint)).toEqual(url)
    })

    test('should add slash to the path', () => {
      const baseUrl = 'https://example.com'
      const endpoint = 'api/v1/users'
      const url = 'https://example.com/api/v1/users'
      expect(buildRequestURL(baseUrl, endpoint)).toEqual(url)
    })

    describe('should handle query', () => {
      test('with empty value', () => {
        const baseUrl = 'https://example.com'
        const endpoint = 'api/v1/users'
        const url = 'https://example.com/api/v1/users'
        expect(buildRequestURL(baseUrl, endpoint)).toEqual(url)
      })

      test('with string value', () => {
        const baseUrl = 'https://example.com'
        const endpoint = 'api/v1/users'
        const url = 'https://example.com/api/v1/users?name=John+Doe'
        expect(
          buildRequestURL(baseUrl, endpoint, {
            name: 'John Doe',
          }),
        ).toEqual(url)
      })

      test('with number value', () => {
        const baseUrl = 'https://example.com'
        const endpoint = 'api/v1/users'
        const url = 'https://example.com/api/v1/users?age=25'
        expect(
          buildRequestURL(baseUrl, endpoint, {
            age: 25,
          }),
        ).toEqual(url)
      })

      test('with boolean value', () => {
        const baseUrl = 'https://example.com'
        const endpoint = 'api/v1/users'
        const url = 'https://example.com/api/v1/users?active=true'
        expect(
          buildRequestURL(baseUrl, endpoint, {
            active: true,
          }),
        ).toEqual(url)
      })

      test('with multiple values', () => {
        const baseUrl = 'https://example.com'
        const endpoint = 'api/v1/users'
        const url =
          'https://example.com/api/v1/users?name=John+Doe&age=25&active=true'
        expect(
          buildRequestURL(baseUrl, endpoint, {
            name: 'John Doe',
            age: 25,
            active: true,
          }),
        ).toEqual(url)
      })

      test('with array value', () => {
        const baseUrl = 'https://example.com'
        const endpoint = 'api/v1/users'
        const url = 'https://example.com/api/v1/users?name=John+Doe%2CJane+Doe'
        expect(
          buildRequestURL(baseUrl, endpoint, {
            name: ['John Doe', 'Jane Doe'],
          }),
        ).toEqual(url)
      })

      test('with JSON API query field names', () => {
        const baseUrl = 'https://example.com'
        const endpoint = 'api/v1/users'
        const url =
          'https://example.com/api/v1/users?filter%5Bname%5D=John+Doe&page%5Blimit%5D=15'
        expect(
          buildRequestURL(baseUrl, endpoint, {
            'filter[name]': 'John Doe',
            'page[limit]': 15,
          }),
        ).toEqual(url)
      })
    })
  })
})
