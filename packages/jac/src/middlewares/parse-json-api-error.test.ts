import { errors } from '../errors'
import { parseJsonApiError } from './parse-json-api-error'
import { AxiosError } from 'axios'
import { JsonApiResponseErrors } from '../types'

describe('errors', () => {
  const testCases = [
    {
      name: 'Bad Request',
      status: 400,
      data: { errors: [{}] },
      expectedError: errors.BadRequestError,
    },
    {
      name: 'Not Allowed',
      status: 401,
      data: { errors: [{}] },
      expectedError: errors.UnauthorizedError,
    },
    {
      name: 'Forbidden',
      status: 403,
      data: { errors: [{}] },
      expectedError: errors.ForbiddenError,
    },
    {
      name: 'Not Found',
      status: 404,
      data: { errors: [{}] },
      expectedError: errors.NotFoundError,
    },
    {
      name: 'Conflict',
      status: 409,
      data: { errors: [{}] },
      expectedError: errors.ConflictError,
    },
    {
      name: 'Internal Server Error',
      status: 500,
      data: { errors: [{}] },
      expectedError: errors.InternalServerError,
    },
    {
      name: 'Unexpected error',
      status: 488,
      data: { errors: [{}] },
      expectedError: errors.NetworkError,
    },
  ]

  testCases.forEach(testCase => {
    it(`should parse "${testCase.name}" error.`, () => {
      const error = parseJsonApiError({
        response: {
          status: testCase.status,
          data: testCase.data,
        },
      } as AxiosError<JsonApiResponseErrors>)

      expect(error).toBeInstanceOf(testCase.expectedError)
    })
  })
})
