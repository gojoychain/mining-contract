const { assert } = require('chai')
const TimeMachine = require('sol-time-machine')
const sassert = require('sol-assert')

const getConstants = require('../constants')
const ProofOfTransactionMock = artifacts.require('ProofOfTransactionMock')

const web3 = global.web3

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
        web3.utils.toBN('400000000000000000000000'))
      assert.equal(
        await methods.withdrawInterval().call(), 
        web3.utils.toBN('28800'))
      assert.equal(
        await methods.lastWithdrawBlock().call(), 
        await web3.eth.getBlockNumber())
    })
  })

  describe.only('withdraw', () => {
    beforeEach(async () => {
      // Fund contract
      await web3.eth.sendTransaction({
        from: OWNER,
        to: contractAddr,
        value: web3.utils.toBN('50000000000000000000'),
      })
      assert.isTrue(await web3.eth.getBalance(contractAddr) > 0)
    })

    it('should increment the withdraw counter after a withdraw', async () => {
      // Advance to valid interval
      let lastWithdraw = await methods.lastWithdrawBlock().call()
      let nextWithdraw = Number(lastWithdraw) + Number(withdrawInterval)
      await timeMachine.mineTo(nextWithdraw)
      sassert.bnEqual(await web3.eth.getBlockNumber(), nextWithdraw)

      assert.equal(await methods.withdrawCounter().call(), 0)
      await methods.withdraw().send({ from: OWNER })
      assert.equal(await methods.withdrawCounter().call(), 1)
    })
  })
})
