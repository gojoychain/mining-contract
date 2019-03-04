pragma solidity ^0.5.4;

import "../mining/MiningContract.sol";

contract MiningContractMock is MiningContract {
    /**
     * @param owner Owner of the contract.
     */
    constructor(address owner) Ownable(owner) public validAddress(owner) {
        _withdrawAmount = 100 * 10**18;
        _withdrawInterval = 100;
        _lastWithdrawBlock = block.number;
    }
}
