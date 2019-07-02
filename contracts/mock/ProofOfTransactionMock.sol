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
    }

    function withdraw() public {
        require(
            block.number - _lastWithdrawBlock >= _withdrawInterval, 
            "Blocks from last withdrawal not greater than the withdraw interval."
        );
        
        _lastWithdrawBlock = _lastWithdrawBlock.add(_withdrawInterval);
        _receiver.transfer(_withdrawAmount);
        
        // Decrement withdrawAmount by 10% every quarter (90 days) until it hits 250k daily
        _withdrawCounter = _withdrawCounter + 1;
        if (_withdrawCounter == WITHDRAW_COUNTER_RESET) {
            uint256 newWithdraw = _withdrawAmount * 90 / 100;
            
            // Transition from quarter 5 to 6 the amount goes under the min amount
            // so need to set it to the min amount.
            if (newWithdraw < MIN_WITHDRAW_AMOUNT) {
                newWithdraw = MIN_WITHDRAW_AMOUNT;
            }

            _withdrawAmount = newWithdraw;
            _withdrawCounter = 0;
        }

        emit Withdrawal(_receiver, _withdrawAmount);
    }

    function withdrawCounter() public view returns (uint8 counter) {
        return _withdrawCounter;
    }
}
