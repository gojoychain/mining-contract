pragma solidity ^0.5.4;

contract IMiningContract {
    address internal _receiver;
    uint256 internal _withdrawAmount;
    uint256 internal _withdrawInterval;
    uint256 internal _lastWithdrawBlock;

    event Withdrawal(address indexed to, uint256 amount);

    /**
     * Withdraws the withdrawAmount if the currentBlock - lastWithdrawBlock >= withdrawInterval.
     * @return Flag for successful withdrawal
     */
    function withdraw() public returns (bool success);

    /**
     * @return Amount that can be withdrawn.
     */
    function withdrawAmount() public view returns (uint256 amount);

    /**
     * @return Minimum number of blocks between each allowed withdraw.
     */
    function withdrawInterval() public view returns (uint256 interval);

    /**
     * @return Block number of the last withdrawal.
     */ 
    function lastWithdrawBlock() public view returns (uint256 lastBlock);
}
