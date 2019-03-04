const { assert } = require('chai')
const TimeMachine = require('sol-time-machine')
const sassert = require('sol-assert')

const getConstants = require('../constants')
const MiningContractMock = require('../data/mining-contract-mock')

const web3 = global.web3

contract('MiningContractMock', (accounts) => {
  const { OWNER, ACCT1 } = getConstants(accounts)
  const timeMachine = new TimeMachine(web3)
  
  let contract
  let withdrawAmount
  let withdrawInterval

  beforeEach(async () => {
    await timeMachine.snapshot

    contract = new web3.eth.Contract(MiningContractMock.abi)
    contract = await contract.deploy({
      data: MiningContractMock.bytecode,
      arguments: [OWNER],
    }).send({ from: OWNER, gas: 4712388 })

    withdrawAmount = await contract.methods.withdrawAmount().call()
    withdrawInterval = await contract.methods.withdrawInterval().call()
  })
  
  afterEach(async () => {
    await timeMachine.revert
  })

  describe('constructor', () => {
    it('should initialize all the values correctly', async () => {
      sassert.bnEqual(
        await contract.methods.withdrawAmount().call(), 
        '1000000000000000000')
      sassert.bnEqual(await contract.methods.withdrawInterval().call(), '10')
      sassert.bnEqual(
        await contract.methods.lastWithdrawBlock().call(), 
        await web3.eth.getBlockNumber())
    })
  })

  describe('fallback', () => {
    it('should accept native tokens', async () => {
      sassert.bnEqual(await web3.eth.getBalance(contract._address), 0)

      await web3.eth.sendTransaction({
        from: ACCT1,
        to: contract._address,
        value: 1,
      })
      sassert.bnEqual(await web3.eth.getBalance(contract._address), 1)
    })
  })

  describe('withdraw', () => {
    it('withdraws the expected amount', async () => {
      // Fund contract
      await web3.eth.sendTransaction({
        from: OWNER,
        to: contract._address,
        value: web3.utils.toBN('50000000000000000000'),
      })
      assert.isTrue(await web3.eth.getBalance(contract._address) > 0)

      // Advance to valid interval
      const lastWithdraw = await contract.methods.lastWithdrawBlock().call()
      await timeMachine.mineTo(lastWithdraw + withdrawInterval)
      sassert.bnEqual(await web3.eth.getBlockNumber(), lastWithdraw + withdrawInterval)

      // Withdraw
      let contractBal = await web3.eth.getBalance(contract._address)
      let ownerBal = await web3.eth.getBalance(OWNER)
      await contract.methods.withdraw().send({ from: OWNER })
      sassert.bnEqual(
        await web3.eth.getBalance(contract._address), 
        web3.utils.toBN(contractBal).sub(web3.utils.toBN(withdrawAmount))),
      sassert.bnGTE(
        await web3.eth.getBalance(OWNER),
        ownerBal,
      )
    })

    it('throws if trying to withdraw from a non-owner', async () => {
      try {
        await contract.methods.withdraw().send({ from: ACCT1 })
      } catch (e) {
        sassert.revert(e)
      }
    })

    it('throws if trying to withdraw too early', async () => {
      const current = await web3.eth.getBlockNumber()
      const lastWithdraw = await contract.methods.lastWithdrawBlock().call()
      assert.isFalse(current - lastWithdraw >= withdrawInterval)

      try {
        await contract.methods.withdraw().send({ from: OWNER })
      } catch (e) {
        sassert.revert(e)
      }
    })
  })
})
