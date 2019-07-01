pragma solidity ^0.5.10;

import "../mining/ProofOfTransaction.sol";

contract ProofOfTransactionMock is ProofOfTransaction {
    uint256 internal constant INIT_WITHDRAW_AMOUNT = 1 * 10**18;
    uint256 internal constant MIN_WITHDRAW_AMOUNT = 8 * 10**17;
    uint8 internal constant WITHDRAW_COUNTER_RESET = 2;
    uint8 internal _withdrawCounter = 0;

    constructor(address payable owner) ProofOfTransaction(owner) public {
        _withdrawAmount = INIT_WITHDRAW_AMOUNT;
        _withdrawInterval = 10;
        _lastWithdrawBlock = block.number;
    }
}
