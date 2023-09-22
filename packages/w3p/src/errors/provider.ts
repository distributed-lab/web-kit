import { RuntimeError } from '@distributedlab/tools'

export class ProviderNotInitializedError extends RuntimeError {
  public name = 'ProviderNotInitializedError'

  constructor(error = new TypeError('Provider is not initialized')) {
    super(error)
  }
}

export class ProviderInjectedInstanceNotFoundError extends RuntimeError {
  public name = 'ProviderInjectedInstanceNotFoundError'

  constructor(
    error = new TypeError(
      'Cant find injected provider instance in window object, please check your provider installation',
    ),
  ) {
    super(error)
  }
}

export class ProviderChainNotFoundError extends RuntimeError {
  public name = 'ProviderChainNotFoundError'

  constructor(error = new TypeError('Cant detect chain in provider')) {
    super(error)
  }
}

export class ProviderChainDetailsNotFoundError extends RuntimeError {
  public name = 'ProviderChainDetailsAreEmptyError'

  constructor(error = new TypeError('Cant find chains details in provider')) {
    super(error)
  }
}

export class ProviderUserRejectedRequest extends RuntimeError {
  public name = 'ProviderUserRejectedRequest'

  constructor(error = new TypeError('User rejected request')) {
    /**
     * @description ethers.js match provider `user denied` error message
     * and throw it's own error instance,
     * so we override error message with our own
     *
     * https://github.com/ethers-io/ethers.js/blob/13593809bd61ef24c01d79de82563540d77098db/src.ts/providers/provider-jsonrpc.ts#L822
     */
    super('User rejected request', error)
  }
}

export class ProviderUnauthorized extends RuntimeError {
  public name = 'ProviderUnauthorized'

  constructor(error = new TypeError('Provider unauthorized')) {
    super(error)
  }
}

export class ProviderUnsupportedMethod extends RuntimeError {
  public name = 'ProviderUnsupportedMethod'

  constructor(error = new TypeError('Provider not support this method')) {
    super(error)
  }
}

export class ProviderDisconnected extends RuntimeError {
  public name = 'ProviderDisconnected'

  constructor(error = new TypeError('Provider has been disconnected')) {
    super(error)
  }
}

export class ProviderChainDisconnected extends RuntimeError {
  public name = 'ProviderChainDisconnected'

  constructor(error = new TypeError('Provider chain has been disconnected')) {
    super(error)
  }
}

export class ProviderParseError extends RuntimeError {
  public name = 'ProviderParseError'

  constructor(error = new TypeError('Provider failed to parse')) {
    super(error)
  }
}

export class ProviderInvalidRequest extends RuntimeError {
  public name = 'ProviderInvalidRequest'

  constructor(error = new TypeError('Provider returned invalid request')) {
    super(error)
  }
}

export class ProviderMethodNotFound extends RuntimeError {
  public name = 'ProviderMethodNotFound'

  constructor(
    error = new TypeError('Provider method not implemented or not found'),
  ) {
    super(error)
  }
}

export class ProviderInvalidParams extends RuntimeError {
  public name = 'ProviderInvalidParams'

  constructor(error = new TypeError('Provider returned invalid params')) {
    super(error)
  }
}

export class ProviderInternalError extends RuntimeError {
  public name = 'ProviderInternalError'

  constructor(error = new TypeError('Provider internal error')) {
    super(error)
  }
}

export class ProviderInvalidInput extends RuntimeError {
  public name = 'ProviderInvalidInput'

  constructor(error = new TypeError('Provider returned invalid input')) {
    super(error)
  }
}

export class ProviderResourceNotFound extends RuntimeError {
  public name = 'ProviderResourceNotFound'

  constructor(error = new TypeError('Provider resource not found')) {
    super(error)
  }
}

export class ProviderResourceUnavailable extends RuntimeError {
  public name = 'ProviderResourceUnavailable'

  constructor(error = new TypeError('Provider resource unavailable')) {
    super(error)
  }
}

export class ProviderTransactionRejected extends RuntimeError {
  public name = 'ProviderTransactionRejected'

  constructor(error = new TypeError('Provider transaction rejected')) {
    super(error)
  }
}

export class ProviderMethodNotSupported extends RuntimeError {
  public name = 'ProviderMethodNotSupported'

  constructor(error = new TypeError('Provider method not supported')) {
    super(error)
  }
}

export class ProviderLimitExceeded extends RuntimeError {
  public name = 'ProviderLimitExceeded'

  constructor(error = new TypeError('Provider limit exceeded')) {
    super(error)
  }
}

export class ProviderJsonRpcVersionNotSupported extends RuntimeError {
  public name = 'ProviderJsonRpcVersionNotSupported'

  constructor(
    error = new TypeError('Provider json rpc version not supported'),
  ) {
    super(error)
  }
}

export class ProviderJsonRpcInvalid extends RuntimeError {
  public name = 'ProviderJsonRpcInvalid'

  constructor(error = new TypeError('Provider json rpc invalid')) {
    super(error)
  }
}
