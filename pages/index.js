import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [inputAmount, setInputAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  // Get wallet (MetaMask) on page load
  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    } else {
      alert("MetaMask is required. Please install it.");
    }
  };

  // Handle account setup
  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };

  // Connect to MetaMask account
  const connectAccount = async () => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }

    try {
      const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
      handleAccount(accounts[0]);
      getATMContract();
      await checkOwner(accounts[0]);
    } catch (error) {
      console.error("Failed to connect account:", error);
    }
  };

  // Get contract instance
  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
    setATM(atmContract);
  };

  // Check contract ownership
  const checkOwner = async (connectedAccount) => {
    if (atm) {
      try {
        const owner = await atm.getOwner();
        if (owner.toLowerCase() !== connectedAccount.toLowerCase()) {
          alert("You are not the owner of this contract.");
        } else {
          console.log("Account is the owner");
        }
      } catch (error) {
        console.error("Error checking owner:", error);
      }
    }
  };

  // Get the balance of the contract
  const getBalance = async () => {
    if (atm) {
      try {
        const balanceWei = await atm.getBalance();
        const balanceEth = ethers.utils.formatEther(balanceWei);
        setBalance(parseFloat(balanceEth).toFixed(0));
      } catch (error) {
        console.error("Failed to fetch balance:", error);
      }
    }
  };
  

  // Handle deposit functionality
  const deposit = async () => {
    if (atm && inputAmount !== "") {
      const amountWei = ethers.utils.parseEther(inputAmount);
      try {
        console.log("Current Account: ", account);
        const owner = await atm.getOwner();
        console.log("Contract Owner: ", owner);

        if (owner.toLowerCase() !== account.toLowerCase()) {
          alert("You are not the owner of this contract.");
          return;
        }

        let tx = await atm.deposit({ value: amountWei });
        await tx.wait();
        getBalance(); // Update the balance
        setInputAmount("");
      } catch (error) {
        console.error("Deposit failed:", error);
      }
    }
  };

  // Handle withdraw functionality
  const withdraw = async () => {
    if (atm && withdrawAmount !== "") {
      const amountWei = ethers.utils.parseEther(withdrawAmount);
      try {
        console.log("Current Account: ", account);
        const owner = await atm.getOwner();
        console.log("Contract Owner: ", owner);

        if (owner.toLowerCase() !== account.toLowerCase()) {
          alert("You are not the owner of this contract.");
          return;
        }

        let tx = await atm.withdraw(amountWei);
        await tx.wait();
        getBalance(); // Update the balance after withdrawal
        setWithdrawAmount("");
      } catch (error) {
        console.error("Withdraw failed:", error);
      }
    }
  };

  // Initialize user interface
  useEffect(() => {
    getWallet();
  }, []);

  useEffect(() => {
    if (account && atm) {
      getBalance();
    }
  }, [account, atm]);

  return (
    <main className="container">
      <header>
        <h1>Welcome to the Metacrafters ATM!</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
        }
      `}</style>
    </main>
  );

  // User interface function
  function initUser() {
    if (!ethWallet) {
      return <p>Please install MetaMask in order to use this ATM.</p>;
    }

    if (!account) {
      return <button onClick={connectAccount}>Please connect your MetaMask wallet</button>;
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance !== undefined ? `${balance} ETH` : "Loading..."}</p>
        <div>
          <input
            type="text"
            placeholder="Enter amount (ETH) to deposit"
            value={inputAmount}
            onChange={(e) => setInputAmount(e.target.value)}
          />
          <button onClick={deposit}>Deposit</button>
        </div>
        <div>
          <input
            type="text"
            placeholder="Enter amount (ETH) to withdraw"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
          />
          <button onClick={withdraw}>Withdraw</button> {/* Update the button */}
        </div>
      </div>
    );
  }
}
