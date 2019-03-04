pragma solidity ^0.5.4;

contract IMiningContract {
    uint256 internal _withdrawAmount;
    uint256 internal _withdrawInterval;
    uint256 internal _lastWithdrawBlock;

    event Withdrawal(address indexed to, uint256 amount);

    /**
     * @return Amount that can be withdrawn.
     */
    function withdrawAmount() public view returns (uint256 withdrawAmount);

    /**
     * @return Minimum number of blocks between each allowed withdraw.
     */
    function withdrawInterval() public view returns (uint256 withdrawInterval);

    /**
     * @return Block number of the last withdrawal.
     */ 
    function lastWithdrawBlock() public view returns (uint256 lastWithdrawBlock);

    /**
     * Withdraws the withdrawAmount if the currentBlock - lastWithdrawBlock >= withdrawInterval.
     * @return Flag for successful withdrawal
     */
    function withdraw() public returns (boolean success);
}
