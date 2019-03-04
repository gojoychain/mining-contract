pragma solidity ^0.5.4;

import "./MiningContract.sol";

contract ProofOfTransaction is MiningContract {
    /**
     * @param owner Owner of the contract.
     */
    constructor(address owner) Ownable(owner) public validAddress(owner) {
        _withdrawAmount = 180000 * 10**18;
        _withdrawInterval = 28800;
        _lastWithdrawBlock = block.number;
    }
}
