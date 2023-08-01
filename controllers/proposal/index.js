const express = require('express')
const router = express.Router()
const PinataSDK = require('@pinata/sdk')
const { PINATA_API_KEY, PINATA_API_SECRET } = require('../../config')
const upload = require('../../routes/upload')
const { MYHOST, IPFS_URL } = require('../../config')
const auth = require('../../middlewares/auth')
const Proposal = require('../../models/propose.model')

router.get(`/`, (req, res) => {
    res.json(`send`)
})

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

// thumbnal 등록
router.post('/', auth, upload.single('thumbnail'), async (req, res, next) => {
    try {
        const { title, content, proposal_id } = req.body

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
        const uniqueKey = `${user.account}:${proposal_id}`
        const PinataServiceMessage = {
            metadata,
            uniqueKey,
        }

        const { IpfsHash } = await PinataService(PinataServiceMessage)
        await Proposal.create({ account: user.account, proposal_id, IpfsHash })

        res.status(201).json({
            account: user.account,
            IpfsHash,
            ipfs: `${IPFS_URL}/${IpfsHash}`,
        })
    } catch (e) {
        next(e)
    }
})

module.exports = router
