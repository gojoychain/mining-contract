const { assert } = require('chai')
const TimeMachine = require('sol-time-machine')
const sassert = require('sol-assert')

const getConstants = require('../constants')
const MiningContractMock = artifacts.require('MiningContractMock')

const web3 = global.web3

contract('MiningContractMock', (accounts) => {
  const { OWNER, ACCT1, MAX_GAS, INVALID_ADDR } = getConstants(accounts)
  const timeMachine = new TimeMachine(web3)
  
  let contractAddr, methods
  let withdrawAmount
  let withdrawInterval

  beforeEach(timeMachine.snapshot)
  afterEach(timeMachine.revert)

  beforeEach(async () => {
    const contract = await MiningContractMock.new(OWNER, 
      { from: OWNER, gas: MAX_GAS })
    contractAddr = contract.contract._address
    methods = contract.contract.methods

    withdrawAmount = await methods.withdrawAmount().call()
    withdrawInterval = await methods.withdrawInterval().call()
  })
  
  describe('constructor', () => {
    it('should initialize all the values correctly', async () => {
      assert.equal(await methods.owner().call(), OWNER)
      assert.equal(await methods.receiver().call(), OWNER)
      sassert.bnEqual(await methods.withdrawAmount().call(), '1000000000000000000')
      sassert.bnEqual(await methods.withdrawInterval().call(), '100')
      sassert.bnEqual(
        await methods.lastWithdrawBlock().call(), 
        await web3.eth.getBlockNumber())
    })

    it('throws if passing an invalid owner', async () => {
      try {
        await MiningContractMock.new(INVALID_ADDR, { from: OWNER, gas: MAX_GAS })
      } catch (e) {
        sassert.revert(e, 'Requires valid address.')
      }
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
    describe('valid block', () => {
      beforeEach(async () => {
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
      })

      it('withdraws the expected amount', async () => {
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
          web3.utils.toBN(contractBal1).sub(web3.utils.toBN(withdrawAmount)))
        sassert.bnGTE(await web3.eth.getBalance(OWNER), ownerBal1)
  
        // Withdraw 2, back to back
        const contractBal2 = await web3.eth.getBalance(contractAddr)
        const ownerBal2 = await web3.eth.getBalance(OWNER)
        await methods.withdraw().send({ from: OWNER })
        sassert.bnEqual(
          await web3.eth.getBalance(contractAddr), 
          web3.utils.toBN(contractBal2).sub(web3.utils.toBN(withdrawAmount)))
        sassert.bnGTE(await web3.eth.getBalance(OWNER), ownerBal2)
        sassert.bnLTE(contractBal2, contractBal1)
        sassert.bnGTE(ownerBal2, ownerBal1)
      })
      
      it('increments the lastWithdrawBlock by the withdrawInterval', async () => {
        await methods.withdraw().send({ from: OWNER })
        sassert.bnEqual(await methods.lastWithdrawBlock().call(), nextWithdraw)
      })

      it('emits the Withdrawal event', async () => {
        const tx = await methods.withdraw().send({ from: OWNER })
        sassert.event(tx, 'Withdrawal')
      })
    })
    
    describe('invalid block', () => {
      it('throws if trying to withdraw too early', async () => {
        const current = await web3.eth.getBlockNumber()
        const lastWithdraw = await methods.lastWithdrawBlock().call()
        assert.isFalse(current - lastWithdraw >= withdrawInterval)
  
        await sassert.revert(
          methods.withdraw().send({ from: OWNER }),
          'Blocks from last withdrawal not greater than the withdraw interval.')
      })
    })
  })
})
