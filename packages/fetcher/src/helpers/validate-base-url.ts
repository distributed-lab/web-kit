export const validateBaseUrl = (baseUrl: string): void => {
  try {
    new URL(baseUrl)
  } catch (err) {
    throw new TypeError(
      `Fetcher: invalid base URL. ${(err as Error).toString()}`,
    )
  }
}
