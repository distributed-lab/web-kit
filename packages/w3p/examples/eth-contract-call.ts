// @ts-nocheck
import { computed } from 'vue'
import { Erc20__factory } from '@/types'
import { BigNumberish, ethers } from 'ethers'
import { useWeb3ProvidersStore } from '@/store'
import { PROVIDERS } from '@distributedlab/w3p'

export const useErc20Contract = (address: string) => {
  const web3ProvidersStore = useWeb3ProvidersStore()

  const provider = computed(() => web3ProvidersStore.provider)

  const rawProvider = computed(() =>
    provider.value.providerType !== PROVIDERS.Fallback
      ? new ethers.providers.Web3Provider(
        provider.value.rawProvider as ethers.providers.ExternalProvider,
        'any',
      )
      : (provider.value
        .rawProvider as unknown as ethers.providers.JsonRpcProvider),
  )

  const contractInstance = computed(
    () =>
      (!!provider.value &&
        !!address &&
        !!rawProvider.value &&
        !!address &&
        Erc20__factory.connect(address, rawProvider.value)) ||
      undefined,
  )

  const contractInterface = Erc20__factory.createInterface()

  const approve = async (spender: string, amount: BigNumberish) => {
    const data = contractInterface.encodeFunctionData('approve', [
      spender,
      amount,
    ])

    return provider.value.signAndSendTx({
      to: address,
      data,
    })
  }

  const decreaseAllowance = async (
    spender: string,
    subtractedValue: BigNumberish,
  ) => {
    const data = contractInterface.encodeFunctionData('decreaseAllowance', [
      spender,
      subtractedValue,
    ])

    return provider.value.signAndSendTx({
      to: address,
      data,
    })
  }

  const increaseAllowance = async (
    spender: string,
    addedValue: BigNumberish,
  ) => {
    const data = contractInterface.encodeFunctionData('increaseAllowance', [
      spender,
      addedValue,
    ])

    return provider.value.signAndSendTx({
      to: address,
      data,
    })
  }

  const mint = async (to: string, amount: BigNumberish) => {
    const data = contractInterface.encodeFunctionData('mint', [to, amount])

    return provider.value.signAndSendTx({
      to: address,
      data,
    })
  }

  const renounceOwnership = async () => {
    const data = contractInterface.encodeFunctionData('renounceOwnership')

    return provider.value.signAndSendTx({
      to: address,
      data,
    })
  }

  const transfer = async (address: string, amount: BigNumberish) => {
    const data = contractInterface.encodeFunctionData('transfer', [
      address,
      amount,
    ])

    return provider.value.signAndSendTx({
      to: address,
      data,
    })
  }

  const transferFrom = async (
    from: string,
    to: string,
    amount: BigNumberish,
  ) => {
    const data = contractInterface.encodeFunctionData('transferFrom', [
      from,
      to,
      amount,
    ])

    return provider.value.signAndSendTx({
      to: address,
      data,
    })
  }

  const getAllowance = async (owner: string, spender: string) => {
    return contractInstance.value?.allowance(owner, spender)
  }

  const getBalanceOf = async (address: string) => {
    return contractInstance.value?.balanceOf(address)
  }

  const getDecimals = async () => {
    return contractInstance.value?.decimals()
  }

  const getName = async () => {
    return contractInstance.value?.name()
  }

  const getOwner = async () => {
    return contractInstance.value?.owner()
  }

  const getSymbol = async () => {
    return contractInstance.value?.symbol()
  }

  const getTotalSupply = async () => {
    return contractInstance.value?.totalSupply()
  }

  return {
    approve,
    decreaseAllowance,
    increaseAllowance,
    mint,
    renounceOwnership,
    transfer,
    transferFrom,
    getAllowance,
    getBalanceOf,
    getDecimals,
    getName,
    getOwner,
    getSymbol,
    getTotalSupply,
  }
}
