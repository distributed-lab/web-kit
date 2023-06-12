import { newFetcherResponseBuilder } from './response-builder'
import { ERROR_RESPONSE } from './tests'

const RESPONSE_CFG = {
  status: 200,
  headers: { 'Content-Type': 'application/json' },
}

const ERROR_CFG = {
  status: 401,
  headers: { 'Content-Type': 'application/json' },
}

const REQUEST_CFG = { url: 'http://localhost:3000' }

describe('performs FetcherResponseBuilder', () => {
  test('should build response with JSON body', async () => {
    const response = new Response('{"foo": "bar"}', RESPONSE_CFG)
    const result = await newFetcherResponseBuilder(
      REQUEST_CFG,
      response,
    ).build()

    expect(result.status).toEqual(200)
    expect(result.data).toEqual({ foo: 'bar' })
  })

  test('should build response with empty body', async () => {
    const response = new Response(null, { ...RESPONSE_CFG, status: 204 })
    const result = await newFetcherResponseBuilder(
      REQUEST_CFG,
      response,
    ).build()

    expect(result.status).toEqual(204)
    expect(result.data).toEqual(undefined)
  })

  test('should build response with blob body', async () => {
    const byteArray = new Uint8Array([
      3, 101, 179, 31, 17, 201, 89, 249, 154, 206, 194, 64, 116, 7, 163, 57,
      165, 180, 202, 46, 204, 207, 17, 251, 48, 177, 106, 229, 152, 97, 225,
      224, 143,
    ])
    const blob = new Blob([byteArray], { type: 'application/json' })
    const response = new Response(blob, RESPONSE_CFG)
    const result = await newFetcherResponseBuilder(
      REQUEST_CFG,
      response,
    ).build()

    expect(result.data).toEqual(blob)
  })

  test('should build valid error response', async () => {
    const response = new Response(JSON.stringify(ERROR_RESPONSE), ERROR_CFG)
    const result = await newFetcherResponseBuilder(
      REQUEST_CFG,
      response,
    ).build()

    expect(result.data).toEqual(ERROR_RESPONSE)
  })

  test('should build valid error response with empty body', async () => {
    const response = new Response(null, ERROR_CFG)
    const result = await newFetcherResponseBuilder(
      REQUEST_CFG,
      response,
    ).build()

    expect(result.data).toEqual(undefined)
  })
})
