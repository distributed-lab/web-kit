import type { FetcherError } from '@distributedlab/fetcher'

import type {
  JsonApiErrorMetaType,
  JsonApiResponseErrors,
  JsonApiResponseNestedErrors,
} from '@/types'

/**
 * Generic server error response.
 */

export class JsonApiError extends Error {
  public name = 'JsonApiError'
  public message: string
  readonly #originalError: FetcherError<JsonApiResponseErrors>
  readonly #meta: JsonApiErrorMetaType
  readonly #nestedErrors: JsonApiResponseNestedErrors

  constructor(originalError: FetcherError<JsonApiResponseErrors>) {
    super()

    const errors = originalError?.response?.data?.errors || []
    const unwrappedError = errors?.[0]
    const detail = unwrappedError?.detail ?? ''
    const title = unwrappedError?.title ?? ''

    this.message = `${title}: ${detail}`

    this.#originalError = originalError
    this.#meta = unwrappedError?.meta ?? {}

    if (errors.length > 1) {
      this.message = 'Request contains multiple errors. Check "nestedErrors"'
    }

    this.#nestedErrors = errors.map(err => ({
      title: err?.title ?? '',
      detail: err?.detail ?? '',
      meta: err?.meta ?? {},
    }))
  }

  /**
   * Response HTTP status.
   */
  get httpStatus(): number | undefined {
    return this.#originalError?.response?.status
  }

  /**
   * Error meta.
   */
  get meta(): JsonApiErrorMetaType {
    return this.#meta
  }

  get requestPath(): string | undefined {
    return new URL(this.#originalError?.response?.request?.url).pathname
  }

  /**
   * Errors for every invalid field.
   */
  get nestedErrors(): JsonApiResponseNestedErrors {
    return this.#nestedErrors
  }
}

export class BadRequestError extends JsonApiError {
  public name = 'BadRequestError'
  constructor(originalError: FetcherError<JsonApiResponseErrors>) {
    super(originalError)
  }
}

/**
 * 401(Unauthorized) error.
 */
export class UnauthorizedError extends JsonApiError {
  public name = 'UnauthorizedError'
  constructor(originalError: FetcherError<JsonApiResponseErrors>) {
    super(originalError)
  }
}

/**
 * 403(Forbidden) error.
 */
export class ForbiddenError extends JsonApiError {
  public name = 'ForbiddenError'
  constructor(originalError: FetcherError<JsonApiResponseErrors>) {
    super(originalError)
  }
}

/**
 * (404)The requested resource was not found.
 */
export class NotFoundError extends JsonApiError {
  public name = 'NotFoundError'
  constructor(originalError: FetcherError<JsonApiResponseErrors>) {
    super(originalError)
  }
}

/**
 * The request could not be completed due to a conflict with the current state
 * of the target resource.
 */
export class ConflictError extends JsonApiError {
  public name = 'ConflictError'
  constructor(originalError: FetcherError<JsonApiResponseErrors>) {
    super(originalError)
  }
}

/**
 * 500(Internal server) error
 */
export class InternalServerError extends JsonApiError {
  public name = 'InternalServerError'
  constructor(originalError: FetcherError<JsonApiResponseErrors>) {
    super(originalError)
  }
}

/**
 * Network error.
 */
export class NetworkError extends JsonApiError {
  public name = 'NetworkError'
  constructor(originalError: FetcherError<JsonApiResponseErrors>) {
    super(originalError)
  }
}
