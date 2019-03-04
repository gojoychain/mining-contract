pragma solidity ^0.5.4;

import "./IMiningContract.sol";
import "../lib/Ownable.sol";

contract MiningContract is IMiningContract, Ownable {
    modifier validAddress(address _address) {
        require(_address != address(0), "Requires valid address.");
        _;
    }

    function() external payable { }

    function withdraw() public onlyOwner returns (bool success) {
        require(
            block.number - _lastWithdrawBlock >= _withdrawInterval, 
            "Blocks from last withdrawal not greater than the withdraw interval."
        );
        
        _lastWithdrawBlock = block.number;
        msg.sender.transfer(_withdrawAmount);

        emit Withdrawal(msg.sender, _withdrawAmount);

        return true;
    }

    function withdrawAmount() public view returns (uint256 amount) {
        return _withdrawAmount;
    }

    function withdrawInterval() public view returns (uint256 interval) {
        return _withdrawInterval;
    }

    function lastWithdrawBlock() public view returns (uint256 lastBlock) {
        return _lastWithdrawBlock;
    }
}
