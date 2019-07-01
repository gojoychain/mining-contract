pragma solidity ^0.5.4;

import "./IMiningContract.sol";
import "../lib/Ownable.sol";
import "../lib/SafeMath.sol";

contract MiningContract is IMiningContract, Ownable {
    using SafeMath for uint256;
    
    modifier validAddress(address _address) {
        require(_address != address(0), "Requires valid address.");
        _;
    }

    constructor(address owner) Ownable(owner) public validAddress(owner) {
        _receiver = owner;
    }

    function() external payable { }

    function withdraw() public onlyOwner returns (bool success) {
        require(
            block.number - _lastWithdrawBlock >= _withdrawInterval, 
            "Blocks from last withdrawal not greater than the withdraw interval."
        );
        
        _lastWithdrawBlock = _lastWithdrawBlock.add(_withdrawInterval);
        msg.sender.transfer(_withdrawAmount);

        emit Withdrawal(msg.sender, _withdrawAmount);

        return true;
    }

    function setReceiver(
        address newReceiver)
        public
        onlyOwner
        validAddress(newReceiver)
    {
        address old = _receiver;
        _receiver = newReceiver;

        emit ReceiverSet(old, newReceiver);
    }

    function receiver() public view returns (address) {
        return _receiver;
    }

    function withdrawAmount() public view returns (uint256) {
        return _withdrawAmount;
    }

    function withdrawInterval() public view returns (uint256) {
        return _withdrawInterval;
    }

    function lastWithdrawBlock() public view returns (uint256) {
        return _lastWithdrawBlock;
    }
}
