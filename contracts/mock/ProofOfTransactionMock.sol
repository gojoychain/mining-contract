pragma solidity ^0.5.4;

import "../mining/ProofOfTransaction.sol";

contract ProofOfTransactionMock is MiningContract {
    uint256 internal constant MIN_WITHDRAW_AMOUNT = 5 * 10**17;
    uint8 internal constant MAX_WITHDRAW_COUNTER = 2;
    uint8 internal _withdrawCounter = 0;

    /**
     * @param owner Owner of the contract.
     */
    constructor(address owner) Ownable(owner) public validAddress(owner) {
        _withdrawAmount = 1 * 10**18;
        _withdrawInterval = 10;
        _lastWithdrawBlock = block.number;
    }

    function withdraw() public onlyOwner returns (bool success) {
        require(
            block.number - _lastWithdrawBlock >= _withdrawInterval, 
            "Blocks from last withdrawal not greater than the withdraw interval."
        );
        
        _lastWithdrawBlock = _lastWithdrawBlock.add(_withdrawInterval);
        msg.sender.transfer(_withdrawAmount);
        
        // Decrement withdrawAmount by 10% every quarter (90 days) until it hits 250k daily
        _withdrawCounter = _withdrawCounter + 1;
        if (_withdrawCounter == MAX_WITHDRAW_COUNTER) {
            uint256 newWithdraw = _withdrawAmount * 90 / 100;
            
            // Transition from quarter 5 to 6 the amount goes under the min amount
            // so need to set it to the min amount.
            if (newWithdraw < MIN_WITHDRAW_AMOUNT) {
                newWithdraw = MIN_WITHDRAW_AMOUNT;
            }

            _withdrawAmount = newWithdraw;
            _withdrawCounter = 0;
        }

        emit Withdrawal(msg.sender, _withdrawAmount);

        return true;
    }

    function withdrawCounter() public view returns (uint8 counter) {
        return _withdrawCounter;
    }
}
