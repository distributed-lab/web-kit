import { HTTP_METHODS } from '@distributedlab/fetcher'

import type { JsonApiClient } from './json-api'
import { parseJsonApiResponse } from './middlewares'
import {
  MockWrapper,
  PARSED_RESPONSE,
  RAW_RESPONSE,
  WITHOUT_LINKS_RAW_RESPONSE,
} from './tests'
import { JsonApiLinkFields } from './types'

jest.mock('./json-api')

describe('JsonApi response data parsing unit test', () => {
  let mockedApi: jest.Mocked<JsonApiClient>

  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()

    mockedApi = MockWrapper.getMockedApi()
  })

  test('should return correctly parsed response', () => {
    const rawResponse = MockWrapper.makeFetcherResponse(RAW_RESPONSE)
    const response = parseJsonApiResponse({
      raw: rawResponse,
      isNeedRaw: false,
      apiClient: mockedApi,
    })
    expect(response.data).toStrictEqual(PARSED_RESPONSE)
  })

  test('should return undefined if data is empty', () => {
    const rawResponse = MockWrapper.makeFetcherResponse({})
    const response = parseJsonApiResponse({
      raw: rawResponse,
      isNeedRaw: false,
      apiClient: mockedApi,
    })
    expect(response.data).toBeUndefined()
  })

  test('should have correct raw response and raw data', () => {
    const rawResponse = MockWrapper.makeFetcherResponse(RAW_RESPONSE)
    const response = parseJsonApiResponse({
      raw: rawResponse,
      isNeedRaw: false,
      apiClient: mockedApi,
    })

    expect(response.rawResponse).toStrictEqual(rawResponse)
    expect(response.rawData).toStrictEqual(rawResponse.data)
  })

  test('should create correct link from response', () => {
    const { JsonApiClient } = jest.requireActual('./json-api')

    const rawResponse = MockWrapper.makeFetcherResponse(RAW_RESPONSE)

    const api = new JsonApiClient({ baseUrl: 'https://localhost:8095/core' })

    const response = parseJsonApiResponse({
      raw: rawResponse,
      isNeedRaw: false,
      apiClient: api,
    })

    expect(response.createLink(response.links.next!)).toBe(
      '/meta-buy-orders?filter%5Bowner%5D=3d38fff3-847f-45f2-a267-891ba90dac37&include=meta_sell_order%2Cmeta_sell_order.token%2Cmeta_sell_order.token.metadata&page%5Blimit%5D=5&page%5Bnumber%5D=1&page%5Border%5D=desc',
    )
  })

  test('should create correct link from response if link has no match with base URL', () => {
    const { JsonApiClient } = jest.requireActual('./json-api')

    const response = parseJsonApiResponse({
      raw: MockWrapper.makeFetcherResponse(RAW_RESPONSE),
      isNeedRaw: false,
      apiClient: new JsonApiClient({ baseUrl: 'https://localhost:8095' }),
    })

    expect(response.createLink(response.links.next!)).toBe(
      '/core/meta-buy-orders?filter%5Bowner%5D=3d38fff3-847f-45f2-a267-891ba90dac37&include=meta_sell_order%2Cmeta_sell_order.token%2Cmeta_sell_order.token.metadata&page%5Blimit%5D=5&page%5Bnumber%5D=1&page%5Border%5D=desc',
    )
  })

  test('should return raw response', () => {
    const rawResponse = MockWrapper.makeFetcherResponse(RAW_RESPONSE)
    const response = parseJsonApiResponse({
      raw: rawResponse,
      isNeedRaw: true,
      apiClient: mockedApi,
    })

    expect(response.data).toStrictEqual(rawResponse.data)
  })

  test('should have links object', () => {
    const rawResponse = MockWrapper.makeFetcherResponse(RAW_RESPONSE)
    const response = parseJsonApiResponse({
      raw: rawResponse,
      isNeedRaw: false,
      apiClient: mockedApi,
    })

    expect(response.links).toBeDefined()
    expect(response.isLinksExist).toBeTruthy()
  })

  test('should have valid page limit', () => {
    const url = new URL('http://localhost')
    url.searchParams.set('page[limit]', '100')

    const rawResponse = MockWrapper.makeFetcherResponse(RAW_RESPONSE, 200, {
      url: url.toString(),
    })

    const response = parseJsonApiResponse({
      raw: rawResponse,
      isNeedRaw: false,
      apiClient: mockedApi,
    })

    expect(response.pageLimit).toBe(100)
  })

  test('should throw exception if "links" is empty', () => {
    const rawResponse = MockWrapper.makeFetcherResponse(
      WITHOUT_LINKS_RAW_RESPONSE,
    )

    const response = parseJsonApiResponse({
      raw: rawResponse,
      isNeedRaw: false,
      apiClient: mockedApi,
    })

    expect(response.fetchPage(JsonApiLinkFields.next)).rejects.toThrow(
      'There are no links in response',
    )
  })

  test('should fetch next page', async () => {
    const rawResponse = MockWrapper.makeFetcherResponse(RAW_RESPONSE, 200, {
      url: '',
      method: HTTP_METHODS.GET,
      headers: {},
    })

    const response = parseJsonApiResponse({
      raw: rawResponse,
      isNeedRaw: false,
      apiClient: mockedApi,
    })

    mockedApi.request.mockImplementationOnce(
      () => new Promise(resolve => resolve(response)),
    )

    await response.fetchPage(JsonApiLinkFields.next)

    expect(mockedApi.request).toBeCalledWith({
      endpoint: response.links.next,
      method: 'GET',
      headers: {},
      isNeedRaw: false,
    })
  })
})
