import {
  setupWalletSelector,
  type Wallet,
  type WalletSelector,
} from '@near-wallet-selector/core'
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet'
import type { providers } from 'near-api-js'

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

  async signAndSendTxs(
    txBody: NearTxRequestBody,
  ): Promise<providers.FinalExecutionOutcome[]> {
    if (!this.wallet) return []

    const outcome = await this.wallet.signAndSendTransactions(txBody)

    return outcome || []
  }
}
