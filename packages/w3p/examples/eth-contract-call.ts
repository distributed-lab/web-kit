// @ts-nocheck
import { computed } from 'vue'
import { Erc20__factory } from '@/types'
import { handleEthError, sleep } from '@/helpers'
import { BigNumberish, ethers } from 'ethers'
import { useWeb3ProvidersStore } from '@/store'
import { EthProviderRpcError, PROVIDERS } from '@distributedlab/w3p'

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
    if (!provider.value) return

    try {
      const data = contractInterface.encodeFunctionData('approve', [
        spender,
        amount,
      ])

      const receipt = await provider.value.signAndSendTx({
        to: address,
        data,
      })

      await sleep(1000)
      return receipt
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const decreaseAllowance = async (
    spender: string,
    subtractedValue: BigNumberish,
  ) => {
    if (!provider.value) return

    try {
      const data = contractInterface.encodeFunctionData('decreaseAllowance', [
        spender,
        subtractedValue,
      ])

      const receipt = await provider.value.signAndSendTx({
        to: address,
        data,
      })

      await sleep(1000)
      return receipt
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const increaseAllowance = async (
    spender: string,
    addedValue: BigNumberish,
  ) => {
    if (!provider.value) return

    try {
      const data = contractInterface.encodeFunctionData('increaseAllowance', [
        spender,
        addedValue,
      ])

      const receipt = await provider.value.signAndSendTx({
        to: address,
        data,
      })

      await sleep(1000)
      return receipt
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const mint = async (to: string, amount: BigNumberish) => {
    if (!provider.value) return

    try {
      const data = contractInterface.encodeFunctionData('mint', [to, amount])

      const receipt = await provider.value.signAndSendTx({
        to: address,
        data,
      })

      await sleep(1000)
      return receipt
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const renounceOwnership = async () => {
    if (!provider.value) return

    try {
      const data = contractInterface.encodeFunctionData('renounceOwnership')

      const receipt = await provider.value.signAndSendTx({
        to: address,
        data,
      })

      await sleep(1000)
      return receipt
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const transfer = async (address: string, amount: BigNumberish) => {
    if (!provider.value) return

    try {
      const data = contractInterface.encodeFunctionData('transfer', [
        address,
        amount,
      ])

      const receipt = await provider.value.signAndSendTx({
        to: address,
        data,
      })

      await sleep(1000)
      return receipt
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const transferFrom = async (
    from: string,
    to: string,
    amount: BigNumberish,
  ) => {
    if (!provider.value) return

    try {
      const data = contractInterface.encodeFunctionData('transferFrom', [
        from,
        to,
        amount,
      ])

      const receipt = await provider.value.signAndSendTx({
        to: address,
        data,
      })

      await sleep(1000)
      return receipt
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const getAllowance = async (owner: string, spender: string) => {
    if (!contractInstance.value) return

    try {
      return contractInstance.value?.allowance(owner, spender)
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const getBalanceOf = async (address: string) => {
    if (!contractInstance.value) return

    try {
      return contractInstance.value?.balanceOf(address)
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const getDecimals = async () => {
    if (!contractInstance.value) return

    try {
      return contractInstance.value?.decimals()
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const getName = async () => {
    if (!contractInstance.value) return

    try {
      return contractInstance.value?.name()
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const getOwner = async () => {
    if (!contractInstance.value) return

    try {
      return contractInstance.value?.owner()
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const getSymbol = async () => {
    if (!contractInstance.value) return

    try {
      return contractInstance.value?.symbol()
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const getTotalSupply = async () => {
    if (!contractInstance.value) return

    try {
      return contractInstance.value?.totalSupply()
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
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
