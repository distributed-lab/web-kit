// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mockWindow = (value: any) => {
  global.window = value
}

export const clearWindowMock = () => {
  global.window = undefined as never
}
