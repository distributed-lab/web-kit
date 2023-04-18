export enum EIP1193 {
  userRejectedRequest = 4001,
  unauthorized = 4100,
  unsupportedMethod = 4200,
  disconnected = 4900,
  chainDisconnected = 4901,
  unrecognizedChain = 4902,
}

export enum EIP_1193_STRING {
  userRejectedRequest = 'ACTION_REJECTED',
}

export enum EIP1474 {
  parseError = -32700,
  invalidRequest = -32600,
  methodNotFound = -32601,
  invalidParams = -32602,
  internalError = -32603,
  invalidInput = -32000,
  resourceNotFound = -32001,
  resourceUnavailable = -32002,
  transactionRejected = -32003,
  methodNotSupported = -32004,
  limitExceeded = -32005,
  jsonRpcVersionNotSupported = -32006,
}

export enum ETHEREUM_PROVIDER_INTERNAL_ERRORS {
  accessDenied = 'access denied',
  failedAcceptRequest = 'failed to accept request',
  failedRejectRequest = 'failed to reject request',
  invalidRequestStatus = 'invalid request status',
  zeroExecutor = 'zero executor',
  notRequestCreator = 'not a request creator',
  emptyValue = 'empty value',
  // eslint-disable-next-line prettier/prettier
  mappingNotExist = 'this mapping doesn\'t exist',
  constantNotExist = 'constant does not exist',
  notProxyContract = 'not a proxy contract',
  zeroAddressForbidden = 'zero address is forbidden',
  emptyRoles = 'empty roles',
  capExceeded = 'cap exceeded',
  callerNotFactory = 'caller is not a factory',
  badProxyBeacon = 'bad ProxyBeacon',
  noPoolsInject = 'no pools to inject',
  failedRegisterContract = 'failed to register contract',
  userHasPendingRequests = 'user has a pending requests',
  userHasNoRequests = 'user has no request',
  userHasNoPendingRequests = 'user has no pending requests',
  emptyKycRole = 'empty KYC role',
}
