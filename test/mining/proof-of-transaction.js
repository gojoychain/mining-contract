const { assert } = require('chai')
const TimeMachine = require('sol-time-machine')
const sassert = require('sol-assert')

const getConstants = require('../constants')
const ProofOfTransactionMock = artifacts.require('ProofOfTransactionMock')

const web3 = global.web3

const decrementAmount = (withdrawAmount) => {
  return web3.utils.toBN(withdrawAmount)
    .mul(web3.utils.toBN(90))
    .div(web3.utils.toBN(100))
}

contract('ProofOfTransactionMock', (accounts) => {
  const { OWNER, MAX_GAS } = getConstants(accounts)
  const timeMachine = new TimeMachine(web3)
  
  let contractAddr, methods
  let withdrawInterval

  beforeEach(timeMachine.snapshot)
  afterEach(timeMachine.revert)

  beforeEach(async () => {
    const proofOfTx = await ProofOfTransactionMock.new(OWNER, { from: OWNER, gas: MAX_GAS })
    contractAddr = proofOfTx.contract._address
    methods = proofOfTx.contract.methods

    withdrawInterval = await methods.withdrawInterval().call()
  })
  
  describe('constructor', () => {
    it('should initialize all the values correctly', async () => {
      assert.equal(
        await methods.withdrawAmount().call(), 
        web3.utils.toBN('1000000000000000000'))
      assert.equal(await methods.withdrawInterval().call(), web3.utils.toBN('10'))
      assert.equal(
        await methods.lastWithdrawBlock().call(), 
        await web3.eth.getBlockNumber())
    })
  })

  describe('withdraw', () => {
    beforeEach(async () => {
      // Fund contract
      await web3.eth.sendTransaction({
        from: OWNER,
        to: contractAddr,
        value: web3.utils.toBN('50000000000000000000'),
      })
      assert.isTrue(await web3.eth.getBalance(contractAddr) > 0)
    })

    it('should increment the withdrawCounter after a withdraw', async () => {
      // Advance to valid interval
      let lastWithdraw = await methods.lastWithdrawBlock().call()
      let nextWithdraw = Number(lastWithdraw) + Number(withdrawInterval)
      await timeMachine.mineTo(nextWithdraw)
      sassert.bnEqual(await web3.eth.getBlockNumber(), nextWithdraw)

      assert.equal(await methods.withdrawCounter().call(), 0)
      await methods.withdraw().send({ from: OWNER })
      assert.equal(await methods.withdrawCounter().call(), 1)
    })

    it('should reset the withdrawCounter if it hits the WITHDRAW_COUNTER_RESET', async () => {
      // Advance to valid interval
      let lastWithdraw = await methods.lastWithdrawBlock().call()
      let nextWithdraw = Number(lastWithdraw) + Number(withdrawInterval)
      await timeMachine.mineTo(nextWithdraw)
      sassert.bnEqual(await web3.eth.getBlockNumber(), nextWithdraw)

      // Withdraw 1
      await methods.withdraw().send({ from: OWNER })
      assert.equal(await methods.withdrawCounter().call(), 1)

      // Advance to next interval
      lastWithdraw = await methods.lastWithdrawBlock().call()
      nextWithdraw = Number(lastWithdraw) + Number(withdrawInterval)
      await timeMachine.mineTo(nextWithdraw)
      sassert.bnEqual(await web3.eth.getBlockNumber(), nextWithdraw)

      // Withdraw 2. Should reset back to 0.
      await methods.withdraw().send({ from: OWNER })
      assert.equal(await methods.withdrawCounter().call(), 0)
    })

    it('should execute the logic if it hits the WITHDRAW_COUNTER_RESET', async () => {
      // 10e18
      let withdrawAmount = await methods.withdrawAmount().call();

      // Advance to valid interval
      let lastWithdraw = await methods.lastWithdrawBlock().call()
      let nextWithdraw = Number(lastWithdraw) + Number(withdrawInterval)
      await timeMachine.mineTo(nextWithdraw)
      sassert.bnEqual(await web3.eth.getBlockNumber(), nextWithdraw)

      // Withdraw 1
      await methods.withdraw().send({ from: OWNER })
      assert.equal(await methods.withdrawCounter().call(), 1)

      // Advance to next interval
      lastWithdraw = await methods.lastWithdrawBlock().call()
      nextWithdraw = Number(lastWithdraw) + Number(withdrawInterval)
      await timeMachine.mineTo(nextWithdraw)
      sassert.bnEqual(await web3.eth.getBlockNumber(), nextWithdraw)

      // Withdraw 2
      // withdrawCounter should reset back to 0
      // withdrawAmount decreases by 10% = 9e17
      await methods.withdraw().send({ from: OWNER })
      assert.equal(await methods.withdrawCounter().call(), 0)
      withdrawAmount = decrementAmount(withdrawAmount)
      assert.equal(await methods.withdrawAmount().call(), withdrawAmount)

      // Advance to next interval
      lastWithdraw = await methods.lastWithdrawBlock().call()
      nextWithdraw = Number(lastWithdraw) + Number(withdrawInterval)
      await timeMachine.mineTo(nextWithdraw)
      sassert.bnEqual(await web3.eth.getBlockNumber(), nextWithdraw)

      // Withdraw 3
      await methods.withdraw().send({ from: OWNER })
      assert.equal(await methods.withdrawCounter().call(), 1)

      // Advance to next interval
      lastWithdraw = await methods.lastWithdrawBlock().call()
      nextWithdraw = Number(lastWithdraw) + Number(withdrawInterval)
      await timeMachine.mineTo(nextWithdraw)
      sassert.bnEqual(await web3.eth.getBlockNumber(), nextWithdraw)

      // Withdraw 4
      // withdrawCounter should reset back to 0
      // withdrawAmount decreases by 10% = 8.1e17
      await methods.withdraw().send({ from: OWNER })
      assert.equal(await methods.withdrawCounter().call(), 0)
      withdrawAmount = decrementAmount(withdrawAmount)
      assert.equal(await methods.withdrawAmount().call(), withdrawAmount)

      // Advance to next interval
      lastWithdraw = await methods.lastWithdrawBlock().call()
      nextWithdraw = Number(lastWithdraw) + Number(withdrawInterval)
      await timeMachine.mineTo(nextWithdraw)
      sassert.bnEqual(await web3.eth.getBlockNumber(), nextWithdraw)

      // Withdraw 5
      await methods.withdraw().send({ from: OWNER })
      assert.equal(await methods.withdrawCounter().call(), 1)

      // Advance to next interval
      lastWithdraw = await methods.lastWithdrawBlock().call()
      nextWithdraw = Number(lastWithdraw) + Number(withdrawInterval)
      await timeMachine.mineTo(nextWithdraw)
      sassert.bnEqual(await web3.eth.getBlockNumber(), nextWithdraw)

      // Withdraw 6
      // withdrawCounter should reset back to 0
      // withdrawAmount decreases by 10% under min amount = 8e17
      await methods.withdraw().send({ from: OWNER })
      assert.equal(await methods.withdrawCounter().call(), 0)
      withdrawAmount = web3.utils.toBN('800000000000000000')
      assert.equal(await methods.withdrawAmount().call(), withdrawAmount)

      // Advance to next interval
      lastWithdraw = await methods.lastWithdrawBlock().call()
      nextWithdraw = Number(lastWithdraw) + Number(withdrawInterval)
      await timeMachine.mineTo(nextWithdraw)
      sassert.bnEqual(await web3.eth.getBlockNumber(), nextWithdraw)

      // Withdraw 7
      await methods.withdraw().send({ from: OWNER })
      assert.equal(await methods.withdrawCounter().call(), 1)

      // Advance to next interval
      lastWithdraw = await methods.lastWithdrawBlock().call()
      nextWithdraw = Number(lastWithdraw) + Number(withdrawInterval)
      await timeMachine.mineTo(nextWithdraw)
      sassert.bnEqual(await web3.eth.getBlockNumber(), nextWithdraw)

      // Withdraw 8
      // withdrawCounter should reset back to 0
      // withdrawAmount should stay at min amount = 8e17
      await methods.withdraw().send({ from: OWNER })
      assert.equal(await methods.withdrawCounter().call(), 0)
      assert.equal(await methods.withdrawAmount().call(), withdrawAmount)
    })
  })
})
