const hre = require("hardhat");

async function main() {
  const initBalance = 1; // Initial balance for the contract deployment
  const Assessment = await hre.ethers.getContractFactory("Assessment"); // Get the contract factory
  const assessment = await Assessment.deploy(initBalance); // Deploy the contract
  await assessment.deployed(); // Wait until the contract is deployed

  console.log(`A contract with balance of ${initBalance} eth deployed to ${assessment.address}`); // Log the address
}

// Error handling
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
