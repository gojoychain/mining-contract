pragma solidity ^0.5.10;

import "../mining/MiningContract.sol";

contract MiningContractMock is MiningContract {
    /**
     * @param owner Owner of the contract.
     */
    constructor(address payable owner) MiningContract(owner) public {
        _withdrawAmount = 1 * 10**18;
        _withdrawInterval = 100;
        _lastWithdrawBlock = block.number;
    }
}
