require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.27",
  networks: {
    amoy: {
      url: "wss://polygon-amoy.g.alchemy.com/v2/oPOU4HEjAm1pjIf9wBTNQw5WyWOiYCxi",
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY
  }
};

