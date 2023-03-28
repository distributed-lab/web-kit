import { HTTP_STATUS_CODES } from '@/enums'

const EMPTY_BODY_STATUS_CODES: { [key in HTTP_STATUS_CODES]?: boolean } = {
  [HTTP_STATUS_CODES.NO_CONTENT]: true,
  [HTTP_STATUS_CODES.RESET_CONTENT]: true,
}

export const isEmptyBodyStatusCode = (code: number): boolean => {
  return Boolean(EMPTY_BODY_STATUS_CODES[code as HTTP_STATUS_CODES])
}
