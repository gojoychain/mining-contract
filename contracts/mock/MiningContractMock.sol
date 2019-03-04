pragma solidity ^0.5.4;

import "../mining/MiningContract.sol";

contract MiningContractMock is MiningContract {
    /**
     * @param owner Owner of the contract.
     */
    constructor(address owner) Ownable(owner) public validAddress(owner) {
        _withdrawAmount = 1 * 10**18;
        _withdrawInterval = 10;
        _lastWithdrawBlock = block.number;
    }
}
