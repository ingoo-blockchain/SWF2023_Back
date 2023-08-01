require('dotenv').config()
const ethers = require('ethers')
const governanceTokenABI = require('../contracts/GovernanceToken.json').abi
const governanceTokenCA = process.env.GOERLI_GOVERNANCE_TOKEN
const governorABI = require('../contracts/GovernorContract.json').abi
const governorCA = process.env.GOERLI_GOVERNOR
const postingABI = require('../contracts/Posting.json').abi
const postingCA = process.env.GOERLI_POSTING
const STORE = 'store'

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

const getProposalState = async (proposalId) => {
    const proposalState = await governor.state(proposalId)
    // 0:Pending, 1:Active, 2:Canceled, 3:Defeated, 4:Succeeded, 5:Queued, 6:Expired, 7:Executed
    return proposalState
}

const getProposalVotes = async (proposalId) => {
    const proposalVotes = await governor.proposalVotes(proposalId)
    return {
        against: fromWei(proposalVotes[0]),
        for: fromWei(proposalVotes[1]),
    }
}

const queueAndExecuteProposal = async (signer, key, value) => {
    const encodedFunctionCall = posting.interface.encodeFunctionData(STORE, [key, value])
    const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(''))
    const queueTx = await governor.connect(signer).queue([posting.address], [0], [encodedFunctionCall], descriptionHash)
    await queueTx.wait(1)

    setTimeout(async () => {
        const executeTx = await governor
            .connect(signer)
            .execute([posting.address], [0], [encodedFunctionCall], descriptionHash)
        await executeTx.wait(1)
    }, 7000)
}

const retrievePosting = async (key) => {
    const ipfsUrl = await posting.retrieve(key)
    return ipfsUrl
}

module.exports = {
    provider,
    governor,
    toWei,
    fromWei,
    createSigner,
    balanceOfGovernanceToken,
    transferGovernanceToken,
    getProposalState,
    getProposalVotes,
    queueAndExecuteProposal,
    retrievePosting,
}
