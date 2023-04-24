import {
  setupWalletSelector,
  type Wallet,
  type WalletSelector,
} from '@near-wallet-selector/core'
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet'
import { providers } from 'near-api-js'

import { NEAR_CHAINS } from '@/enums'
import { ENearWalletId, type NearTxRequestBody } from '@/types'

export class NearRawProvider {
  selector: WalletSelector | null = null
  wallet: Wallet | null = null
  createAccessKeyFor: string
  accountId = ''
  isNear = true

  constructor({ createAccessKeyFor = '' }: { createAccessKeyFor?: string }) {
    this.createAccessKeyFor = createAccessKeyFor
  }

  async init() {
    this.selector = await setupWalletSelector({
      network: NEAR_CHAINS.TestNet,
      modules: [setupMyNearWallet()],
    })

    const isSignedIn = this.selector.isSignedIn()

    if (isSignedIn) {
      this.wallet = await this.selector.wallet()
      this.accountId =
        this.selector?.store?.getState()?.accounts?.[0]?.accountId ?? ''
    }

    return isSignedIn
  }

  async signIn() {
    if (!this.selector || Boolean(this.accountId)) return

    this.wallet = await this.selector.wallet(ENearWalletId.MyNearWallet)
    await this.wallet.signIn({
      contractId: this.createAccessKeyFor,
      methodNames: [],
      accounts: [],
    })
  }

  async signOut() {
    if (!this.wallet) return

    await this.wallet.signOut()
    this.wallet = null
    this.accountId = ''
  }

  // Call a method that changes the contract's state
  async signAndSendTx(txBody: NearTxRequestBody) {
    if (!this.wallet) return

    // Sign a transaction with the "FunctionCall" action
    const outcome = await this.wallet.signAndSendTransactions(txBody)

    return outcome
      ? outcome.map(el => providers.getTransactionLastResult(el))
      : null
  }

  // Get transaction result from the network
  async getTransactionResult(txhash: string) {
    if (!this.selector) return

    const { network } = this.selector.options
    const provider = new providers.JsonRpcProvider({ url: network.nodeUrl })

    // Retrieve transaction result from the network
    const transaction = await provider.txStatus(txhash, 'unnused')
    return providers.getTransactionLastResult(transaction)
  }
}
