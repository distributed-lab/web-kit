import { RuntimeError } from './runtime'

export class ProviderNotInitializedError extends RuntimeError {
  constructor(message?: string) {
    super(message || 'Provider is not initialized')
    this.name = 'ProviderNotInitializedError'
  }
}

export class ProviderInjectedInstanceNotFoundError extends RuntimeError {
  constructor(message?: string) {
    super(
      message ||
        'Cant find injected provider instance in window object, please check your provider installation',
    )
    this.name = 'ProviderInjectedInstanceNotFoundError'
  }
}

export class ProviderChainNotFoundError extends RuntimeError {
  constructor(message?: string) {
    super(message || 'Cant detect chain in provider')
    this.name = 'ProviderChainNotFoundError'
  }
}

export class ProviderUserRejectedRequest extends RuntimeError {
  constructor(message?: string) {
    super(message || 'User rejected request')
    this.name = 'ProviderUserRejectedRequest'
  }
}

export class ProviderUnauthorized extends RuntimeError {
  constructor(message?: string) {
    super(message || 'Provider unauthorized')
    this.name = 'ProviderUnauthorized'
  }
}

export class ProviderUnsupportedMethod extends RuntimeError {
  constructor(message?: string) {
    super(message || 'Provider not support this method')
    this.name = 'ProviderUnsupportedMethod'
  }
}

export class ProviderDisconnected extends RuntimeError {
  constructor(message?: string) {
    super(message || 'Provider has been disconnected')
    this.name = 'ProviderDisconnected'
  }
}

export class ProviderChainDisconnected extends RuntimeError {
  constructor(message?: string) {
    super(message || 'Provider chain has been disconnected')
    this.name = 'ProviderChainDisconnected'
  }
}

export class ProviderParseError extends RuntimeError {
  constructor(message?: string) {
    super(message)
    this.name = 'ProviderParseError'
  }
}

export class ProviderInvalidRequest extends RuntimeError {
  constructor(message?: string) {
    super(message || 'Provider returned invalid request')
    this.name = 'ProviderInvalidRequest'
  }
}

export class ProviderMethodNotFound extends RuntimeError {
  constructor(message?: string) {
    super(message || 'Provider method not implemented or not found')
    this.name = 'ProviderMethodNotFound'
  }
}

export class ProviderInvalidParams extends RuntimeError {
  constructor(message?: string) {
    super(message || 'Provider returned invalid params')
    this.name = 'ProviderInvalidParams'
  }
}

export class ProviderInternalError extends RuntimeError {
  constructor(message?: string) {
    super(message || 'Provider internal error')
    this.name = 'ProviderInternalError'
  }
}

export class ProviderInvalidInput extends RuntimeError {
  constructor(message?: string) {
    super(message || 'Provider returned invalid input')
    this.name = 'ProviderInvalidInput'
  }
}

export class ProviderResourceNotFound extends RuntimeError {
  constructor(message?: string) {
    super(message)
    this.name = 'ProviderResourceNotFound'
  }
}

export class ProviderResourceUnavailable extends RuntimeError {
  constructor(message?: string) {
    super(message)
    this.name = 'ProviderResourceUnavailable'
  }
}

export class ProviderTransactionRejected extends RuntimeError {
  constructor(message?: string) {
    super(message)
    this.name = 'ProviderTransactionRejected'
  }
}

export class ProviderMethodNotSupported extends RuntimeError {
  constructor(message?: string) {
    super(message)
    this.name = 'ProviderMethodNotSupported'
  }
}

export class ProviderLimitExceeded extends RuntimeError {
  constructor(message?: string) {
    super(message)
    this.name = 'ProviderLimitExceeded'
  }
}

export class ProviderJsonRpcVersionNotSupported extends RuntimeError {
  constructor(message?: string) {
    super(message)
    this.name = 'ProviderJsonRpcVersionNotSupported'
  }
}
