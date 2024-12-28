const { ethers } = require('hardhat')
const fs = require('fs')

const toWei = (num) => ethers.utils.parseEther(num.toString())

async function main() {
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
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
