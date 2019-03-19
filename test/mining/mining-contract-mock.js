const { assert } = require('chai')
const TimeMachine = require('sol-time-machine')
const sassert = require('sol-assert')

const getConstants = require('../constants')
const MiningContractMock = artifacts.require('MiningContractMock')

const web3 = global.web3

contract('MiningContractMock', (accounts) => {
  const { OWNER, ACCT1, MAX_GAS } = getConstants(accounts)
  const timeMachine = new TimeMachine(web3)
  
  let contractAddr, methods
  let withdrawAmount
  let withdrawInterval

  beforeEach(async () => {
    await timeMachine.snapshot

    const contract = await MiningContractMock.new(OWNER, 
      { from: OWNER, gas: MAX_GAS })
    contractAddr = contract.contract._address
    methods = contract.contract.methods

    withdrawAmount = await methods.withdrawAmount().call()
    withdrawInterval = await methods.withdrawInterval().call()
  })
  
  afterEach(async () => {
    await timeMachine.revert
  })

  describe('constructor', () => {
    it('should initialize all the values correctly', async () => {
      sassert.bnEqual(await methods.withdrawAmount().call(), '1000000000000000000')
      sassert.bnEqual(await methods.withdrawInterval().call(), '100')
      sassert.bnEqual(
        await methods.lastWithdrawBlock().call(), 
        await web3.eth.getBlockNumber())
    })
  })

  describe('fallback', () => {
    it('should accept native tokens', async () => {
      sassert.bnEqual(await web3.eth.getBalance(contractAddr), 0)

      await web3.eth.sendTransaction({
        from: ACCT1,
        to: contractAddr,
        value: 1,
      })
      sassert.bnEqual(await web3.eth.getBalance(contractAddr), 1)
    })
  })

  describe('withdraw', () => {
    it('withdraws the expected amount', async () => {
      // Fund contract
      await web3.eth.sendTransaction({
        from: OWNER,
        to: contractAddr,
        value: web3.utils.toBN('10000000000000000000'),
      })
      assert.isTrue(await web3.eth.getBalance(contractAddr) > 0)

      // Advance to valid interval
      let lastWithdraw = await methods.lastWithdrawBlock().call()
      let nextWithdraw = Number(lastWithdraw) + Number(withdrawInterval)
      await timeMachine.mineTo(nextWithdraw)
      sassert.bnEqual(await web3.eth.getBlockNumber(), nextWithdraw)

      // Withdraw
      const contractBal1 = await web3.eth.getBalance(contractAddr)
      const ownerBal1 = await web3.eth.getBalance(OWNER)
      await methods.withdraw().send({ from: OWNER })
      sassert.bnEqual(
        await web3.eth.getBalance(contractAddr), 
        web3.utils.toBN(contractBal1).sub(web3.utils.toBN(withdrawAmount))),
      sassert.bnGTE(await web3.eth.getBalance(OWNER), ownerBal1)

      // Advance to valid interval
      lastWithdraw = await methods.lastWithdrawBlock().call()
      nextWithdraw = Number(lastWithdraw) + Number(withdrawInterval)
      await timeMachine.mineTo(nextWithdraw)
      sassert.bnEqual(await web3.eth.getBlockNumber(), nextWithdraw)

      // Withdraw again
      const contractBal2 = await web3.eth.getBalance(contractAddr)
      const ownerBal2 = await web3.eth.getBalance(OWNER)
      await methods.withdraw().send({ from: OWNER })
      sassert.bnEqual(
        await web3.eth.getBalance(contractAddr), 
        web3.utils.toBN(contractBal2).sub(web3.utils.toBN(withdrawAmount))),
      sassert.bnGTE(await web3.eth.getBalance(OWNER), ownerBal2)
      sassert.bnLTE(contractBal2, contractBal1)
      sassert.bnGTE(ownerBal2, ownerBal1)
    })

    it('can withdraw multiple times if multiple intervals have passed', async () => {
      // Fund contract
      await web3.eth.sendTransaction({
        from: OWNER,
        to: contractAddr,
        value: web3.utils.toBN('10000000000000000000'),
      })

      // Advance two intervals
      let lastWithdraw = await methods.lastWithdrawBlock().call()
      let nextWithdraw = Number(lastWithdraw) + (2 * Number(withdrawInterval))
      await timeMachine.mineTo(nextWithdraw)

      // Withdraw 1
      const contractBal1 = await web3.eth.getBalance(contractAddr)
      const ownerBal1 = await web3.eth.getBalance(OWNER)
      await methods.withdraw().send({ from: OWNER })
      sassert.bnEqual(
        await web3.eth.getBalance(contractAddr), 
        web3.utils.toBN(contractBal1).sub(web3.utils.toBN(withdrawAmount))),
      sassert.bnGTE(await web3.eth.getBalance(OWNER), ownerBal1)

      // Withdraw 2, back to back
      const contractBal2 = await web3.eth.getBalance(contractAddr)
      const ownerBal2 = await web3.eth.getBalance(OWNER)
      await methods.withdraw().send({ from: OWNER })
      sassert.bnEqual(
        await web3.eth.getBalance(contractAddr), 
        web3.utils.toBN(contractBal2).sub(web3.utils.toBN(withdrawAmount))),
      sassert.bnGTE(await web3.eth.getBalance(OWNER), ownerBal2)
      sassert.bnLTE(contractBal2, contractBal1)
      sassert.bnGTE(ownerBal2, ownerBal1)
    })

    it('increments the lastWithdrawBlock by the withdrawInterval', async () => {
      // Fund contract
      await web3.eth.sendTransaction({
        from: OWNER,
        to: contractAddr,
        value: web3.utils.toBN('10000000000000000000'),
      })

      // Advance to valid interval
      let lastWithdraw = await methods.lastWithdrawBlock().call()
      let nextWithdraw = Number(lastWithdraw) + Number(withdrawInterval)
      await timeMachine.mineTo(nextWithdraw)

      // Check updated lastWithdrawBlock
      await methods.withdraw().send({ from: OWNER })
      sassert.bnEqual(await methods.lastWithdrawBlock().call(), nextWithdraw)
    })

    it('emits the Withdrawal event', async () => {
      // Fund contract
      await web3.eth.sendTransaction({
        from: OWNER,
        to: contractAddr,
        value: web3.utils.toBN('10000000000000000000'),
      })

      // Advance to valid interval
      let lastWithdraw = await methods.lastWithdrawBlock().call()
      let nextWithdraw = Number(lastWithdraw) + Number(withdrawInterval)
      await timeMachine.mineTo(nextWithdraw)

      // Check updated lastWithdrawBlock
      const tx = await methods.withdraw().send({ from: OWNER })
      sassert.event(tx, 'Withdrawal')
    })

    it('throws if trying to withdraw from a non-owner', async () => {
      try {
        await methods.withdraw().send({ from: ACCT1 })
      } catch (e) {
        sassert.revert(e)
      }
    })

    it('throws if trying to withdraw too early', async () => {
      const current = await web3.eth.getBlockNumber()
      const lastWithdraw = await methods.lastWithdrawBlock().call()
      assert.isFalse(current - lastWithdraw >= withdrawInterval)

      try {
        await methods.withdraw().send({ from: OWNER })
      } catch (e) {
        sassert.revert(e)
      }
    })
  })
})
