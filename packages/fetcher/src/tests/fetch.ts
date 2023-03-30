export const mockFetchResponse = (response: unknown) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  global.fetch = jest.fn(() => Promise.resolve(response))
}
