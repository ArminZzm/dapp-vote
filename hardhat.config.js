require('@nomicfoundation/hardhat-toolbox')
require('dotenv').config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.28',
  defaultNetwork: 'localhost',
  networks: {
    localhost: {
      url: process.env.NEXT_PUBLIC_HARDHAT_JSON_RPC_URL
    },
    sepolia: {
      chainId: 11155111,
      url: process.env.NEXT_PUBLIC_SEPOLIA_JSON_RPC_URL,
      accounts: [process.env.NEXT_PUBLIC_SEPOLIA_ACCOUNT_PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY
    }
  }
}
