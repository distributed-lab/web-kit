import { FetcherError, HTTP_STATUS_CODES } from '@distributedlab/fetcher'

import type { JsonApiError } from '@/errors'
import { errors } from '@/errors'
import type { JsonApiResponseErrors } from '@/types'

/*
 * Parses server error and returns corresponding error instance.
 * Needed to handle on client side different behavior based on error type
 */
export const parseJsonApiError = (
  error: FetcherError<JsonApiResponseErrors>,
): JsonApiError => {
  const status = error?.response?.status

  switch (status) {
    case HTTP_STATUS_CODES.BAD_REQUEST:
      return new errors.BadRequestError(error)
    case HTTP_STATUS_CODES.UNAUTHORIZED:
      return new errors.UnauthorizedError(error)
    case HTTP_STATUS_CODES.FORBIDDEN:
      return new errors.ForbiddenError(error)
    case HTTP_STATUS_CODES.NOT_FOUND:
      return new errors.NotFoundError(error)
    case HTTP_STATUS_CODES.CONFLICT:
      return new errors.ConflictError(error)
    case HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR:
      return new errors.InternalServerError(error)
    default:
      return new errors.NetworkError(error)
  }
}
