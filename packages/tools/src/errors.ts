export class RuntimeError extends Error {
  public name = 'RuntimeError'
  public originalError?: Error

  public constructor(error: Error)
  public constructor(message: string)

  public constructor(...params: unknown[]) {
    if (params.length === 2) {
      const message: string = (
        typeof params[0] === 'string' ? params[0] : params[1]
      ) as string

      const originalError: Error = (
        typeof params[0] === 'string' ? params[1] : params[0]
      ) as Error

      super(message)
      this.originalError = originalError
    } else {
      if (typeof params?.[0] === 'string') {
        super(params[0])
      } else {
        const originalError = params[0] as Error

        super(originalError?.message)

        this.originalError = originalError
      }
    }
  }
}
