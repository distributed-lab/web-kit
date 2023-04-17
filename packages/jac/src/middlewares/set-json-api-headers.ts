import cloneDeep from 'lodash/cloneDeep'

import { JsonApiClientRequestConfigHeaders } from '@/types'

const MIME_TYPE_JSON_API = 'application/vnd.api+json'
const HEADER_CONTENT_TYPE = 'Content-Type'
const HEADER_ACCEPT = 'Accept'

export const setJsonApiHeaders = (
  h: JsonApiClientRequestConfigHeaders,
): JsonApiClientRequestConfigHeaders => {
  const headers = cloneDeep(h) as Record<string, string>

  headers[HEADER_CONTENT_TYPE] = MIME_TYPE_JSON_API
  headers[HEADER_ACCEPT] = MIME_TYPE_JSON_API

  return headers
}
