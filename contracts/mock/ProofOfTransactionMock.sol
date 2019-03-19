pragma solidity ^0.5.4;

import "../mining/ProofOfTransaction.sol";

contract ProofOfTransactionMock is ProofOfTransaction {
    uint256 private constant MIN_WITHDRAW_AMOUNT = 5 * 10**17;
    uint8 private constant MAX_WITHDRAW_COUNTER = 2;
    uint8 private _withdrawCounter = 0;

    constructor(address owner) ProofOfTransaction(owner) public {
        _withdrawAmount = 1 * 10**18;
        _withdrawInterval = 10;
        _lastWithdrawBlock = block.number;
    }
}
