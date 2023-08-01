const express = require('express')
const router = express.Router()

router.get(`/`, async (req, res, next) => {
    try {
        const { page, limit } = req.query

        if (!page || !limit) throw new Error('page, limit query 가 필요합니다.')
        const result = await Proposal.find(1, page, limit)

        res.json(result)
    } catch (e) {
        next(e)
    }
})

router.get('/:proposal_id', async (req, res, next) => {
    try {
        const { proposal_id } = req.params

        if (!proposal_id) throw new Error('Proposal_id가 없습니다.')
        const [result] = await Proposal.findByProposalId(proposal_id, 1)

        res.json(result)
    } catch (e) {
        next(e)
    }
})

module.exports = router
