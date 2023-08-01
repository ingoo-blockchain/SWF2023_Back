require('dotenv').config()
const ethers = require('ethers')
const governanceTokenABI = require('../contracts/GovernanceToken.json').abi
const governanceTokenCA = process.env.GOERLI_GOVERNANCE_TOKEN
const governorABI = require('../contracts/GovernorContract.json').abi
const governorCA = process.env.GOERLI_GOVERNOR
const postingABI = require('../contracts/Posting.json').abi
const postingCA = process.env.GOERLI_POSTING

const network = 'goerli'
const provider = new ethers.providers.AlchemyProvider(network, process.env.ALCHEMY_GOERLI_API_KEY)
const governanceToken = new ethers.Contract(governanceTokenCA, governanceTokenABI, provider)
const governor = new ethers.Contract(governorCA, governorABI, provider)
const posting = new ethers.Contract(postingCA, postingABI, provider)

const toWei = (amount, unit = 'ether') => ethers.utils.parseUnits(amount.toString(), unit)
const fromWei = (amount, unit = 'ether') => ethers.utils.formatUnits(amount.toString(), unit)

const createSigner = (privateKey, provider) => {
    const wallet = new ethers.Wallet(privateKey)
    const signer = wallet.connect(provider)
    return signer
}

const balanceOfGovernanceToken = async (address) => {
    if (!ethers.utils.isAddress(address)) throw new Error('Invalid address')
    const balance = await governanceToken.balanceOf(address)
    return fromWei(balance)
}

const transferGovernanceToken = async (signer, to, amount) => {
    if (!ethers.utils.isAddress(to)) throw new Error('Invalid address')
    await governanceToken.connect(signer).transfer(to, toWei(amount))
}

module.exports = {
    provider,
    toWei,
    fromWei,
    createSigner,
    balanceOfGovernanceToken,
    transferGovernanceToken,
}
