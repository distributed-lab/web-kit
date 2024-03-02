import { BN } from '@distributedlab/tools'
import { PROVIDERS } from '@distributedlab/w3p'
import { computed, toValue, watch } from 'vue'

import { useErc20 } from '@/composables/contracts/erc20'
import { useWeb3Inject } from '@/injects'
import { UiButton } from '@/ui'

const { provider, connect } = useWeb3Inject()

watch(provider, () => {
  console.log('provider', provider.value)
})

const erc20 = computed(() => {
  const rawProvider = provider.value?.rawProvider

  if (!rawProvider) return

  const { contractInterface, contractInstance } = useErc20(
    import.meta.env.VITE_ERC20_CONTRACT_ADDRESS,
    rawProvider,
  )

  return { contractInterface, contractInstance: toValue(contractInstance) }
})

const loadErc20Details = async () => {
  const [balance, decimals] = await Promise.all([
    erc20.value?.contractInstance?.balanceOf(provider.value?.address ?? ''),
    erc20.value?.contractInstance?.decimals(),
  ])

  console.log('balance', balance)
  console.log('decimals', decimals)
}

const sendSimpleTx = async () => {
  const txBody = {
    to: import.meta.env.VITE_ERC20_CONTRACT_ADDRESS,
    data: erc20.value?.contractInterface?.encodeFunctionData('transfer', [
      '0x4148A2eE8D42E63E8d1ADB7F4247A17658730b38',
      BN.fromRaw(1, 18).value,
    ]),
  }

  const receipt = await provider.value?.signAndSendTx(txBody)

  console.log(receipt)
}
