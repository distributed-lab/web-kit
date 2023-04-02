import { HEADERS_NORMALIZE_EXCEPTIONS } from '@/const'

export const normalizeHeadersCase = (headers: HeadersInit): HeadersInit => {
  return Object.entries(headers).reduce((acc, [key, value]) => {
    acc[normalizeHeaderCase(key)] = value

    return acc
  }, {} as Record<string, string>)
}

const normalizeHeaderCase = (header: string): string => {
  const exceptionHeader = HEADERS_NORMALIZE_EXCEPTIONS[header.toLowerCase()]

  if (exceptionHeader) return exceptionHeader

  return header
    .split('-')
    .map(function (text) {
      return text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    })
    .join('-')
}
