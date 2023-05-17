export class RuntimeError extends Error {
  public name = 'RuntimeError'
  public originalError?: Error

  public constructor(errorOrMessage: Error | string)
  public constructor(message: string, error: Error)

  public constructor(errorOrMessage: Error | string, error?: Error) {
    let err
    let msg

    if (error) {
      msg = (errorOrMessage as string) || error.message
      err = error
    } else {
      if (typeof errorOrMessage === 'string') {
        msg = errorOrMessage
      } else {
        msg = errorOrMessage?.message

        err = errorOrMessage
      }
    }

    super(msg)
    this.originalError = err
  }
}
