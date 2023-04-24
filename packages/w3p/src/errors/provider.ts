import { RuntimeError } from './runtime'

export class ProviderNotInitializedError extends RuntimeError {
  public name = 'ProviderNotInitializedError'

  constructor(message = 'Provider is not initialized') {
    super(message)
  }
}

export class ProviderInjectedInstanceNotFoundError extends RuntimeError {
  public name = 'ProviderInjectedInstanceNotFoundError'

  constructor(
    message = 'Cant find injected provider instance in window object, please check your provider installation',
  ) {
    super(message)
  }
}

export class ProviderChainNotFoundError extends RuntimeError {
  public name = 'ProviderChainNotFoundError'

  constructor(message = 'Cant detect chain in provider') {
    super(message)
  }
}

export class ProviderUserRejectedRequest extends RuntimeError {
  public name = 'ProviderUserRejectedRequest'

  constructor(message = 'User rejected request') {
    super(message)
  }
}

export class ProviderUnauthorized extends RuntimeError {
  public name = 'ProviderUnauthorized'

  constructor(message = 'Provider unauthorized') {
    super(message)
  }
}

export class ProviderUnsupportedMethod extends RuntimeError {
  public name = 'ProviderUnsupportedMethod'

  constructor(message = 'Provider not support this method') {
    super(message)
  }
}

export class ProviderDisconnected extends RuntimeError {
  public name = 'ProviderDisconnected'

  constructor(message = 'Provider has been disconnected') {
    super(message)
  }
}

export class ProviderChainDisconnected extends RuntimeError {
  public name = 'ProviderChainDisconnected'

  constructor(message = 'Provider chain has been disconnected') {
    super(message)
  }
}

export class ProviderParseError extends RuntimeError {
  public name = 'ProviderParseError'

  constructor(message = 'Provider failed to parse') {
    super(message)
  }
}

export class ProviderInvalidRequest extends RuntimeError {
  public name = 'ProviderInvalidRequest'

  constructor(message = 'Provider returned invalid request') {
    super(message)
  }
}

export class ProviderMethodNotFound extends RuntimeError {
  public name = 'ProviderMethodNotFound'

  constructor(message = 'Provider method not implemented or not found') {
    super(message)
  }
}

export class ProviderInvalidParams extends RuntimeError {
  public name = 'ProviderInvalidParams'

  constructor(message = 'Provider returned invalid params') {
    super(message)
  }
}

export class ProviderInternalError extends RuntimeError {
  public name = 'ProviderInternalError'

  constructor(message = 'Provider internal error') {
    super(message)
  }
}

export class ProviderInvalidInput extends RuntimeError {
  public name = 'ProviderInvalidInput'

  constructor(message = 'Provider returned invalid input') {
    super(message)
  }
}

export class ProviderResourceNotFound extends RuntimeError {
  public name = 'ProviderResourceNotFound'

  constructor(message?: string) {
    super(message)
  }
}

export class ProviderResourceUnavailable extends RuntimeError {
  public name = 'ProviderResourceUnavailable'

  constructor(message?: string) {
    super(message)
  }
}

export class ProviderTransactionRejected extends RuntimeError {
  public name = 'ProviderTransactionRejected'

  constructor(message?: string) {
    super(message)
  }
}

export class ProviderMethodNotSupported extends RuntimeError {
  public name = 'ProviderMethodNotSupported'

  constructor(message?: string) {
    super(message)
  }
}

export class ProviderLimitExceeded extends RuntimeError {
  public name = 'ProviderLimitExceeded'

  constructor(message?: string) {
    super(message)
  }
}

export class ProviderJsonRpcVersionNotSupported extends RuntimeError {
  public name = 'ProviderJsonRpcVersionNotSupported'

  constructor(message?: string) {
    super(message)
  }
}
