const { assert } = require('chai')
const TimeMachine = require('sol-time-machine')

const getConstants = require('../constants')
const ProofOfContribution = artifacts.require('ProofOfContribution')

const web3 = global.web3

contract('ProofOfContribution', (accounts) => {
  const { OWNER, MAX_GAS } = getConstants(accounts)
  const timeMachine = new TimeMachine(web3)
  
  let proofOfContrib, methods

  beforeEach(async () => {
    await timeMachine.snapshot

    proofOfContrib = await ProofOfContribution.new(OWNER, { from: OWNER, gas: MAX_GAS })
    methods = proofOfContrib.contract.methods
  })
  
  afterEach(async () => {
    await timeMachine.revert
  })

  describe('constructor', async () => {
    it('should initialize all the values correctly', async () => {
      assert.equal(
        await methods.withdrawAmount().call(), 
        web3.utils.toBN('1000000000000000000000000'))
      assert.equal(
        await methods.withdrawInterval().call(), 
        web3.utils.toBN('864000'))
      assert.equal(
        await methods.lastWithdrawBlock().call(), 
        await web3.eth.getBlockNumber())
    })
  })
})
