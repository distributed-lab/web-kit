import { Problem } from '@/problem'

export class RuntimeError extends Error {
  public name = 'RuntimeError'
  public originalError?: Error
  public errorFields: object[] = []

  public constructor(errorOrMessage: Error | string)
  public constructor(message: string, error: Error)
  public constructor(message: string, error: Error, ...errorFields: object[])
  public constructor(
    errorOrMessage: Error | string,
    error?: Error,
    ...errorFields: object[]
  ) {
    const isErrorOrMessageString = typeof errorOrMessage === 'string'
    const message = isErrorOrMessageString
      ? errorOrMessage
      : errorOrMessage?.message

    super(message)

    this.originalError =
      error || isErrorOrMessageString ? undefined : errorOrMessage

    this.errorFields = errorFields
  }

  public toString() {
    let name = this.name

    const originalError = Problem.isRuntimeError(this.originalError)
      ? Problem.cause(this.originalError)
      : this.originalError

    if (originalError && !Problem.isRuntimeError(originalError)) {
      name = `${name}: ${originalError.name}`
    }

    let message = this.message
    let err = this.originalError
    const fields = [...this.errorFields]

    for (;;) {
      if (!err) break

      if (!Problem.isRuntimeError(err)) {
        message += `: ${err.message}`
        break
      }

      err = err.originalError
      fields.push(...(err as RuntimeError).errorFields)
      message += ` :${err!.message}`
    }

    const fieldObj = fields.reduce((acc, field) => {
      acc = { ...acc, ...field }
      return acc
    }, {})

    message = Object.entries(fieldObj).reduce((acc, [key, value]) => {
      acc += ` ${key}: ${JSON.stringify(value)}`
      return acc
    }, message)

    return `${name}: ${message}`
  }
}
