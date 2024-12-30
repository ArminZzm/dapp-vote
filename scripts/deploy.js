const { ethers } = require('hardhat')
const fs = require('fs')

async function main() {
  // deploy contract
  const contract_name = 'DappVotes'
  const contractFactory = await ethers.getContractFactory(contract_name)
  const contract = await contractFactory.deploy()
  await contract.waitForDeployment()

  const address = JSON.stringify({ address: ethers.getAddress(contract.target) }, null, 4)
  fs.writeFile('./artifacts/contractAddress.json', address, 'utf8', (err) => {
    if (err) {
      console.error(err)
      return
    }
    console.log('Deployed contract address', contract.target)
  })

  // verify contract
  if (hre.network.config.chainId == 11155111 && process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY) {
    console.log('Waiting for 5 confirmations')
    await contract.deploymentTransaction().wait(5)
    await verifyContract(contract.target)
  } else {
    console.log('verification skipped..')
  }
}

async function verifyContract(contractAddress, args) {
  await hre.run('verify:verify', {
    address: contractAddress,
    constructorArguments: args
  })
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
