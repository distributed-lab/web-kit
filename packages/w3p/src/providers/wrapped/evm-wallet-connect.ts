import { DECIMALS } from '@distributedlab/tools'
import { WalletConnectModal } from '@walletconnect/modal'
import UniversalProvider from '@walletconnect/universal-provider'
import { providers, utils } from 'ethers'

import {
  CHAIN_TYPES,
  PROVIDER_EVENT_BUS_EVENTS,
  PROVIDER_EVENTS,
  PROVIDERS,
} from '@/enums'
import { getEthExplorerAddressUrl, getEthExplorerTxUrl } from '@/helpers'
import { Provider } from '@/provider'
import type {
  Chain,
  ChainId,
  EthereumProvider,
  EthTransactionResponse,
  ProviderProxy,
  RawProvider,
  TransactionResponse,
  TxRequestBody,
  WalletConnectInitArgs,
} from '@/types'

import { ProviderEventBus } from '../wrapped/_event-bus'

export class WalletConnectEvmProvider
  extends ProviderEventBus
  implements ProviderProxy
{
  #rawProvider: UniversalProvider
  #ethProvider: providers.Web3Provider

  #w3Modal: WalletConnectModal

  #chainId?: ChainId
  #address?: string

  readonly #projectId: string

  constructor(provider: RawProvider) {
    super()

    if (!(provider as WalletConnectInitArgs).projectId) {
      throw new Error('projectId is required for WalletConnect provider')
    }

    const { projectId } = provider as WalletConnectInitArgs
    this.#projectId = projectId
    this.#rawProvider = {} as UniversalProvider
    this.#ethProvider = {} as providers.Web3Provider
    this.#w3Modal = new WalletConnectModal({
      projectId: this.#projectId,
    })
  }

  static get providerType(): PROVIDERS {
    return PROVIDERS.WalletConnect
  }

  get rawProvider() {
    return this.#rawProvider as unknown as RawProvider
  }

  get chainType(): CHAIN_TYPES {
    return CHAIN_TYPES.EVM
  }

  get isConnected(): boolean {
    return Boolean(this.#chainId) || Boolean(this.#address)
  }

  get chainId(): ChainId | undefined {
    return this.#chainId
  }

  get address(): string | undefined {
    return this.#address
  }

  get #defaultEventPayload() {
    return {
      address: this.#address,
      chainId: this.#chainId,
      isConnected: this.isConnected,
    }
  }

  async init(): Promise<void> {
    this.#rawProvider = await UniversalProvider.init({
      logger: 'info',
      relayUrl: 'wss://relay.walletconnect.com',
      projectId: this.#projectId,
    })

    await this.#checkForPersistedSession()

    await this.#setListeners()

    this.emit(PROVIDER_EVENT_BUS_EVENTS.Initiated, this.#defaultEventPayload)
  }

  async connect(): Promise<void> {
    await this.#rawProvider.connect({
      namespaces: {
        eip155: {
          methods: [
            'wallet_switchEthereumChain',
            'wallet_addEthereumChain',
            'eth_requestAccounts',

            'eth_sendTransaction',

            'eth_sign',
            'personal_sign',
            'eth_signTypedData',
          ],
          chains: ['eip155:1'],
          events: [
            PROVIDER_EVENTS.Connect,
            PROVIDER_EVENTS.Disconnect,
            PROVIDER_EVENTS.ChainChanged,
            PROVIDER_EVENTS.AccountsChanged,
          ],
        },
      },
      optionalNamespaces: {
        eip155: {
          methods: [
            'wallet_switchEthereumChain',
            'wallet_addEthereumChain',
            'eth_requestAccounts',

            'eth_sendTransaction',

            'eth_sign',
            'personal_sign',
            'eth_signTypedData',
          ],
          chains: ['eip155:1'],
          events: [
            PROVIDER_EVENTS.Connect,
            PROVIDER_EVENTS.Disconnect,
            PROVIDER_EVENTS.ChainChanged,
            PROVIDER_EVENTS.AccountsChanged,
          ],
        },
      },
      skipPairing: true,
    })

    await this.#rawProvider.enable()

    this.#ethProvider = new providers.Web3Provider(this.#rawProvider)

    const accounts = await this.#rawProvider.request<string[]>({
      method: 'eth_requestAccounts',
    })

    this.#chainId =
      this.#rawProvider?.session?.namespaces?.eip155?.chains?.[0]?.split(':')[1]

    this.#address = accounts?.[0]

    this.emit(
      PROVIDER_EVENT_BUS_EVENTS.AccountChanged,
      this.#defaultEventPayload,
    )

    this.emit(
      this.isConnected
        ? PROVIDER_EVENT_BUS_EVENTS.Connect
        : PROVIDER_EVENT_BUS_EVENTS.Disconnect,
      this.#defaultEventPayload,
    )

    this.#w3Modal.closeModal()
  }

  async disconnect() {
    await this.#rawProvider.disconnect()
    this.#chainId = undefined
    this.#address = undefined
    this.emit(PROVIDER_EVENT_BUS_EVENTS.Disconnect, this.#defaultEventPayload)
  }

  async #checkForPersistedSession() {
    if (!this.#rawProvider) {
      throw new ReferenceError('EthereumProvider is not initialized.')
    }

    if (!this.#rawProvider?.session) return

    this.#chainId =
      this.#rawProvider?.session?.namespaces?.eip155?.chains?.[0]?.split(':')[1]

    this.#address =
      this.#rawProvider?.session?.namespaces?.eip155?.accounts?.[0]?.split(
        ':',
      )?.[2]
  }

  getAddressUrl(chain: Chain, address: string): string {
    return getEthExplorerAddressUrl(chain, address)
  }

  getTxUrl(chain: Chain, txHash: string): string {
    return getEthExplorerTxUrl(chain, txHash)
  }

  getHashFromTx(txResponse: TransactionResponse): string {
    return (txResponse as EthTransactionResponse).transactionHash
  }

  /**
   * @description Switch the chain with WalletConnect Provider.
   * You should always add a network first and then change it.
   */

  async switchChain(chainId: ChainId): Promise<void> {
    if (!Provider.chainsDetails) {
      throw new ReferenceError('Chains details are empty.')
    }
    const foundChain = Provider.chainsDetails[chainId]
    if (!foundChain) {
      throw new ReferenceError('The network you want to change was not found')
    }
    await this.addChain(foundChain)
    await this.#ethProvider?.send?.('wallet_switchEthereumChain', [
      { chainId: foundChain.id },
    ])
  }

  async addChain(chain: Chain): Promise<void> {
    await this.#ethProvider?.send?.('wallet_addEthereumChain', [
      {
        chainId: utils.hexValue(Number(chain.id)),
        chainName: chain.name,
        ...(chain.token.name &&
          chain.token.symbol && {
            nativeCurrency: {
              name: chain.token.name,
              symbol: chain.token.symbol,
              decimals: chain.token.decimals ?? DECIMALS.WEI,
            },
          }),
        rpcUrls: [chain.rpcUrl],
        blockExplorerUrls: [...(chain.explorerUrl ? [chain.explorerUrl] : [])],
        ...(chain.icon && { iconUrls: [chain.icon] }),
      },
    ])
  }

  async signAndSendTx(tx: TxRequestBody): Promise<TransactionResponse> {
    if (!this.#rawProvider) throw new TypeError(`Provider is not initialized`)

    this.emit(PROVIDER_EVENT_BUS_EVENTS.BeforeTxSent, {
      txBody: tx,
    })

    const transactionResponse = await this.#ethProvider?.send(
      'eth_sendTransaction',
      [tx],
    )

    this.emit(PROVIDER_EVENT_BUS_EVENTS.TxSent, {
      txHash: transactionResponse?.hash,
    })

    const receipt = await transactionResponse?.wait()

    this.emit(PROVIDER_EVENT_BUS_EVENTS.TxConfirmed, {
      txResponse: receipt,
    })

    return receipt
  }

  async signMessage(message: string): Promise<string> {
    if (!this.#rawProvider || !this.#address)
      throw new TypeError(`Provider is not initialized`)

    return this.#ethProvider?.send('personal_sign', [
      utils.hexlify(utils.toUtf8Bytes(message)),
      this.#address.toLowerCase(),
    ])
  }

  async #setListeners() {
    ;(this.#rawProvider as unknown as EthereumProvider).on(
      'session_event',
      e => {
        this.#chainId = e?.params?.chainId.split(':')[1] ?? this.#chainId

        this.#address =
          e?.params?.event?.data?.[0]?.split(':')?.[2] ?? this.#address

        this.emit(
          PROVIDER_EVENT_BUS_EVENTS.AccountChanged,
          this.#defaultEventPayload,
        )

        this.emit(
          PROVIDER_EVENT_BUS_EVENTS.ChainChanged,
          this.#defaultEventPayload,
        )

        this.emit(
          this.isConnected
            ? PROVIDER_EVENT_BUS_EVENTS.Connect
            : PROVIDER_EVENT_BUS_EVENTS.Disconnect,
          this.#defaultEventPayload,
        )
      },
    )

    this.#rawProvider.on('session_delete', () => {
      this.emit(PROVIDER_EVENT_BUS_EVENTS.Disconnect, this.#defaultEventPayload)
    })

    this.#rawProvider.on('display_uri', (uri: string) => {
      this.#w3Modal.openModal({ uri })
    })
  }
}
