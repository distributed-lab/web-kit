import cloneDeep from 'lodash/cloneDeep'

import type { JsonApiClientRequestConfigHeaders } from '@/types'

const MIME_TYPE_JSON_API = 'application/vnd.api+json'
const HEADER_CONTENT_TYPE = 'Content-Type'
const HEADER_ACCEPT = 'Accept'

export const setJsonApiHeaders = (
  h: JsonApiClientRequestConfigHeaders,
): JsonApiClientRequestConfigHeaders => {
  return Object.assign(
    {
      [HEADER_CONTENT_TYPE]: MIME_TYPE_JSON_API,
      [HEADER_ACCEPT]: MIME_TYPE_JSON_API,
    },
    cloneDeep(h),
  )
}
