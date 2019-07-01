pragma solidity ^0.5.10;

contract IMiningContract {
    address payable internal _receiver;
    uint256 internal _withdrawAmount;
    uint256 internal _withdrawInterval;
    uint256 internal _lastWithdrawBlock;

    event Withdrawal(address indexed to, uint256 amount);
    event ReceiverSet(address indexed oldReceiver, address indexed newReceiver);

    /**
     * Withdraws the withdrawAmount if the currentBlock - lastWithdrawBlock >= withdrawInterval.
     * @return Flag for successful withdrawal
     */
    function withdraw() public;
    
    /**
     * Sets a new receiver address to receive tokens upon withdraw.
     * @param newReceiver New receiver
     */
    function setReceiver(address payable newReceiver) public;

    /**
     * @return Address who will receive the tokens.
     */
    function receiver() public view returns (address);

    /**
     * @return Amount that can be withdrawn.
     */
    function withdrawAmount() public view returns (uint256);

    /**
     * @return Minimum number of blocks between each allowed withdraw.
     */
    function withdrawInterval() public view returns (uint256);

    /**
     * @return Block number of the last withdrawal.
     */ 
    function lastWithdrawBlock() public view returns (uint256);
}
