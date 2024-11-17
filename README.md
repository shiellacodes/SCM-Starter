# SCM Project: Function Frontend
This is a simple "Function Frontend" project that is required for the completion of ETH PROOF: Intermediate EVM Course. The purpose of this program is to serve as a starting point for those who are interested and curious about Connecting the contract to a frontend using the Solidity Programming Language and HTML/Javascript.

## Description
This program is written in Solidity, HTML, and Javascript. This program serves as an introduction to learn the basic understanding about Connecting the contract to a front end.
## Getting Started
### Installing
### Executing Program

After cloning the github, you will want to do the following to get the code running on your computer.

1. Inside the project directory, in the terminal type: npm i
2. Open two additional terminals in your VS code
3. In the second terminal type: npx hardhat node
4. In the third terminal, type: npx hardhat run --network localhost scripts/deploy.js
5. Back in the first terminal, type npm run dev to launch the front-end.

After this, the project will be running on your localhost. 
Typically at http://localhost:3000/

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Once the contract is deployed, you can interact with it.

By clicking the deposit button, the program will ask you to enter the number of Eth that you want to deposit (increase your Eth). After clicking, a popup from the metamask plugin will be seen, accept the transaction then check the updated value of your Eth.

By clicking the withdraw button, the program will ask you to enter the number of Eth that you want to withdraw (decrease your Eth). After clicking, a popup from the metamask plugin will be seen, accept the transaction then check the updated value of your Eth.

## Author
Shiella Marie P. Umali 202010956@fit.edu.ph


