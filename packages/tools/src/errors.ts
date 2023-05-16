export class RuntimeError extends Error {
  public name = 'RuntimeError'
  public originalError?: Error

  public constructor(errorOrMessage: Error | string)
  public constructor(message: string, error: Error)

  public constructor(errorOrMessage: Error | string, error?: Error) {
    if (error) {
      super(errorOrMessage as string)

      this.originalError = error
    } else {
      if (typeof errorOrMessage === 'string') {
        super(errorOrMessage)
      } else {
        super(errorOrMessage?.message)

        this.originalError = errorOrMessage
      }
    }
  }
}
