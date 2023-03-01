import cloneDeep from 'lodash/cloneDeep'

import {
  JsonApiClientRequestConfig,
  JsonApiClientRequestConfigHeaders,
} from '@/types'

const MIME_TYPE_JSON_API = 'application/vnd.api+json'
const HEADER_CONTENT_TYPE = 'Content-Type'
const HEADER_ACCEPT = 'Accept'

export const setJsonApiHeaders = (
  requestConfig: JsonApiClientRequestConfig,
): JsonApiClientRequestConfigHeaders => {
  const config = cloneDeep(requestConfig)

  config.headers = config.headers ?? {}

  config.headers[HEADER_CONTENT_TYPE] = MIME_TYPE_JSON_API
  config.headers[HEADER_ACCEPT] = MIME_TYPE_JSON_API

  return config.headers
}
