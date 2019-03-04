pragma solidity ^0.5.4;

import "./IMiningContract.sol";

contract MiningContract is IMiningContract, Ownable {
    modifier validAddress(address _address) {
        require(_address != address(0), "Requires valid address.");
        _;
    }
    
    function() external payable { }

    function withdraw() external onlyOwner returns (boolean success) {
        require(block.number - _lastWithdrawBlock >= _withdrawInterval, 
            "Blocks from last withdrawal not greater than the withdraw interval.");
        
        _lastWithdrawBlock = block.number;
        
        address payable owner = owner();
        owner.transfer(_withdrawAmount);

        emit Withdrawal(owner, _withdrawAmount);
    }

    function withdrawAmount() public view returns (uint256 withdrawAmount) {
        return _withdrawAmount;
    }

    function withdrawInterval() public view returns (uint256 withdrawInterval) {
        return _withdrawInterval;
    }

    function lastWithdrawBlock() public view returns (uint256 lastWithdrawBlock) {
        return _lastWithdrawBlock;
    }
}
