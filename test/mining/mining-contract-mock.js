const { assert } = require('chai')
const TimeMachine = require('sol-time-machine')

const getConstants = require('../constants')
const MiningContractMock = require('../data/mining-contract-mock')

const web3 = global.web3

contract('MiningContractMock', (accounts) => {
  const { OWNER, ACCT1 } = getConstants(accounts)
  const timeMachine = new TimeMachine(web3)
  
  let contract

  beforeEach(async () => {
    await timeMachine.snapshot

    contract = new web3.eth.Contract(MiningContractMock.abi)
    contract = await contract.deploy({
      data: MiningContractMock.bytecode,
      arguments: [OWNER],
    }).send({ from: OWNER, gas: 4712388 })
  })
  
  afterEach(async () => {
    await timeMachine.revert
  })

  describe('constructor', () => {
    it('should initialize all the values correctly', async () => {
      assert.equal(
        await contract.methods.withdrawAmount().call(), 
        web3.utils.toBN('100000000000000000000'))
      assert.equal(
        await contract.methods.withdrawInterval().call(), 
        web3.utils.toBN('10'))
      assert.equal(
        await contract.methods.lastWithdrawBlock().call(), 
        await web3.eth.getBlockNumber())
    })
  })

  describe('fallback', () => {
    it('should accept native tokens', async () => {
      assert.equal(await web3.eth.getBalance(contract._address), 0)

      await web3.eth.sendTransaction({
        from: ACCT1,
        to: contract._address,
        value: 1,
      })
      assert.equal(await web3.eth.getBalance(contract._address), 1)
    })
  })
})
