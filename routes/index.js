const express = require('express')
const router = express.Router()
const proposalRoute = require('../controllers/proposal/index')
const userRoute = require('../controllers/users/index')
const postsRoute = require('../controllers/posts/index')

router.get(`/`, (req, res) => {
    res.send(`success`)
})
router.use(`/proposal`, proposalRoute)
router.use(`/users`, userRoute)
router.use(`/posts`, postsRoute)

module.exports = router
