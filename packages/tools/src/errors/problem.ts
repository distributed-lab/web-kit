import log from 'loglevel'

import { EventBus } from '@/events'
import type { ProblemConfig } from '@/types'

import { RuntimeError } from './runtime-error'

let config: ProblemConfig = {
  eventBus: new EventBus(),
}

export class Problem {
  /**
   * `setConfig` overrides default config.
   */
  public static setConfig(cfg: ProblemConfig): void {
    config = { ...config, ...cfg }
  }

  /**
   * `new` returns an error with the supplied message.
   */
  public static new(message: string): RuntimeError {
    return new RuntimeError(message)
  }

  /**
   * `wrap` returns an error annotating err with a stack trace
   * at the point wrap is called, and the supplied message.
   *
   *
   * Fields can optionally be added. If provided, multiple fields will be merged.
   *
   * If err is null, Wrap returns null.
   */
  public static wrap(
    error: Error | RuntimeError | null | undefined,
    message: string,
    ...errorFields: object[]
  ): RuntimeError | null {
    return error ? new RuntimeError(message, error, ...errorFields) : null
  }

  /**
   * `cause` returns the underlying cause of the error, if possible.
   * If the error is null, null will be returned without further
   * investigation.
   */
  public static cause(error?: Error | null): Error | null {
    if (!error) return null
    if (!Problem.isRuntimeError(error)) return error
    return error.originalError ? Problem.cause(error.originalError) : error
  }

  public static isRuntimeError(error?: Error): error is RuntimeError {
    return error instanceof RuntimeError
  }

  /**
   * `handle` handles provided error, error could be logged by default, and
   * emitted via event bus if `eventBus` is set in the config.
   *
   * optional message parameter will be emitted with the error if presented
   */
  public static handle(error: unknown, message?: string): void {
    if (!(error instanceof Error)) return
    config?.eventBus?.error?.({ error, message })
    Problem.handleWithoutFeedback(error)
  }

  /**
   * `handleWithoutFeedback` logs provided an error without emitting it via event bus.
   */
  public static handleWithoutFeedback(error: Error | RuntimeError): void {
    log.error(error)
  }
}
