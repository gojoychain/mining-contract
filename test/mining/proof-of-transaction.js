const { assert } = require('chai')
const TimeMachine = require('sol-time-machine')

const getConstants = require('../constants')
const ProofOfTransaction = require('../data/proof-of-transaction')

const web3 = global.web3

contract('ProofOfTransaction', (accounts) => {
  const { OWNER } = getConstants(accounts)
  const timeMachine = new TimeMachine(web3)
  
  let contract

  beforeEach(async () => {
    await timeMachine.snapshot

    contract = new web3.eth.Contract(ProofOfTransaction.abi)
    contract = await contract.deploy({
      data: ProofOfTransaction.bytecode,
      arguments: [OWNER],
    }).send({ from: OWNER, gas: 4712388 })
  })
  
  afterEach(async () => {
    await timeMachine.revert
  })

  describe('constructor', async () => {
    it('should initialize all the values correctly', async () => {
      assert.equal(
        await contract.methods.withdrawAmount().call(), 
        web3.utils.toBN('180000000000000000000000'))
      assert.equal(
        await contract.methods.withdrawInterval().call(), 
        web3.utils.toBN('28800'))
      assert.equal(
        await contract.methods.lastWithdrawBlock().call(), 
        await web3.eth.getBlockNumber())
    })
  })
})
