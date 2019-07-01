pragma solidity ^0.5.4;

import "./MiningContract.sol";

contract ProofOfInvestment is MiningContract {
    /**
     * @param owner Owner of the contract.
     */
    constructor(address owner) MiningContract(owner) public {
        _withdrawAmount = 3000000 * 10**18;
        _withdrawInterval = 864000;
        _lastWithdrawBlock = block.number;
    }
}
