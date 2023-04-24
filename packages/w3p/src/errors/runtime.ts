export class RuntimeError extends Error {
  public name = 'RuntimeError'

  constructor(message?: string) {
    super(message)
  }
}
