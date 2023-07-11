export const mockWindow = (value: unknown) => {
  global.window = value as Window & typeof globalThis
}

export const clearWindowMock = () => {
  global.window = undefined as unknown as Window & typeof globalThis
}
