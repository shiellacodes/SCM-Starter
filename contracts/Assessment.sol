// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;

    event Deposit(address indexed account, uint256 amount);
    event Withdraw(address indexed account, uint256 amount);

    constructor(uint256 initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    // View function to return the current balance (internal balance)
    function getBalance() public view returns (uint256) {
        return balance;
    }

    // View function to return the actual Ether balance of the contract
    function getContractEtherBalance() public view returns (uint256) {
        return address(this).balance;  // Ether balance of the contract
    }

    // Deposit function now accepts Ether and synchronizes the custom balance with actual Ether balance
    function deposit() public payable {
        require(msg.sender == owner, "You are not the owner of this account");
        require(msg.value > 0, "Deposit amount must be greater than 0");
        
        uint256 _previousBalance = balance;
        
        // Increase internal balance by the Ether sent with the transaction
        balance += msg.value;

        // Emit the deposit event
        emit Deposit(msg.sender, msg.value);

        // Ensure internal balance is updated correctly
        assert(balance == _previousBalance + msg.value);
    }

    // Function to get the owner of the contract
    function getOwner() public view returns (address) {
        return owner;
    }

    // Withdraw function that ensures the contract has enough Ether and sends it to the owner
    function withdraw(uint256 _amount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        require(_amount > 0, "Withdrawal amount must be greater than 0");
        require(balance >= _amount, "Insufficient balance");

        uint256 _previousBalance = balance;

        // Withdraw the specified amount of Ether
        balance -= _amount;
        payable(owner).transfer(_amount); // Transfer the Ether to the owner

        // Emit the withdraw event
        emit Withdraw(msg.sender, _amount);

        // Ensure internal balance is updated correctly
        assert(balance == _previousBalance - _amount);
    }

    // Fallback function to accept any Ether sent to the contract
    receive() external payable {
        deposit();
    }
}
