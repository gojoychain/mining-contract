const { assert } = require('chai')
const TimeMachine = require('sol-time-machine')

const getConstants = require('../constants')
const ProofOfTransaction = artifacts.require('ProofOfTransaction')

const web3 = global.web3

contract.only('ProofOfTransaction', (accounts) => {
  const { OWNER, MAX_GAS } = getConstants(accounts)
  const timeMachine = new TimeMachine(web3)
  
  let proofOfTx, methods

  beforeEach(async () => {
    await timeMachine.snapshot

    proofOfTx = await ProofOfTransaction.new(OWNER, { from: OWNER, gas: MAX_GAS })
    methods = proofOfTx.contract.methods
  })
  
  afterEach(async () => {
    await timeMachine.revert
  })

  describe('constructor', async () => {
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
})
