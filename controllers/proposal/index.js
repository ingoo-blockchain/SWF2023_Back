const express = require('express')
const router = express.Router()
const PinataSDK = require('@pinata/sdk')
const { PINATA_API_KEY, PINATA_API_SECRET } = require('../../config')
const upload = require('../../routes/upload')
const { MYHOST, IPFS_URL, ADMIN_PRIVATE_KEY } = require('../../config')
const auth = require('../../middlewares/auth')
const Proposal = require('../../models/propose.model')
const { getProposalState, queueAndExecuteProposal, createSigner, provider } = require('../../utils/ethers')
const { v4: uuid4 } = require('uuid')
// pinata service
const PinataService = ({ metadata, uniqueKey }) => {
    const pinata = new PinataSDK(PINATA_API_KEY, PINATA_API_SECRET)
    const pinOptions = {
        pinataMetadata: {
            name: `${uniqueKey}.json`,
            keyvalues: {
                penpoll: 'SWF 2023',
            },
        },
        pinataPinOptions: {
            cidVersion: 1,
        },
    }

    const data = pinata.pinJSONToIPFS(metadata, pinOptions)
    return data
}

router.patch(`/`, async (req, res, next) => {
    try {
        const { proposal_id, uuid } = req.body

        if (!proposal_id || !uuid) throw new Error('proposal_id or uuid 가 없습니다.')

        const result = await Proposal.updateByUUID(proposal_id, uuid)

        setTimeout(async () => {
            const statusCode = await getProposalState(proposal_id)
            if (statusCode === 4) {
                // 서명객체만들기
                const signer = createSigner(ADMIN_PRIVATE_KEY, provider)
                queueAndExecuteProposal(signer, uniqueKey, IpfsHash)
            }
        }, 3 * 60 * 1000 + 3 * 1000)

        res.json(result)
    } catch (e) {
        next(e)
    }
})

//
router.get(`/`, async (req, res, next) => {
    try {
        const { page, limit } = req.query

        if (!page || !limit) throw new Error('page, limit query 가 필요합니다.')
        const result = await Proposal.find(page, limit, 0)

        res.json(result)
    } catch (e) {
        next(e)
    }
})

router.get('/votes', async (req, res, next) => {
    try {
        const result = await Proposal.getProposalVotes()
        res.json(result)
    } catch (e) {
        next(e)
    }
})

router.get(`/ipfs/:IpfsHash`, async (req, res, next) => {
    try {
        const { IpfsHash } = req.params
        if (!IpfsHash) throw new Error('IpfsHash 값이 존재하지 않습니다.')
        const result = await Proposal.findByIpfsHash(IpfsHash)
        return result
    } catch (e) {
        next(e)
    }
})

router.get('/:proposal_id', async (req, res, next) => {
    try {
        const { proposal_id } = req.params

        if (!proposal_id) throw new Error('Proposal_id가 없습니다.')
        const [result] = await Proposal.findByProposalId(proposal_id)

        res.json(result)
    } catch (e) {
        next(e)
    }
})

router.get('/:proposal_id/status', async (req, res, next) => {
    try {
    } catch (e) {
        next(e)
    }
})

// thumbnal 등록
router.post('/', auth, upload.single('thumbnail'), async (req, res, next) => {
    try {
        const { title, content } = req.body

        const {
            user,
            file: { path: thumbnail },
        } = req

        const metadata = {
            title,
            content,
            user,
            thumbnail: `${MYHOST}/${thumbnail}`,
        }

        const uuid = uuid4()
        const uniqueKey = `${user.account}:${uuid}`
        const PinataServiceMessage = {
            metadata,
            uniqueKey,
        }

        const { IpfsHash } = await PinataService(PinataServiceMessage)
        await Proposal.create({ account: user.account, uuid, IpfsHash })

        res.status(201).json({
            account: user.account,
            IpfsHash,
            uuid,
            ipfs: `${IPFS_URL}/${IpfsHash}`,
        })
    } catch (e) {
        next(e)
    }
})

module.exports = router
