pragma solidity ^0.5.4;

import "./MiningContract.sol";

contract ProofOfContribution is MiningContract {
    /**
     * @param owner Owner of the contract.
     */
    constructor(address owner) Ownable(owner) public validAddress(owner) {
        _withdrawAmount = 1000000 * 10**18;
        _withdrawInterval = 864000;
        _lastWithdrawBlock = block.number;
    }
}
