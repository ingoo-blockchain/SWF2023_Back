const express = require('express')
const router = express.Router()
const upload = require('../../routes/upload')
const startsWith0x = require('../../utils/startWith0x')
const User = require('../../models/user.model')

router.get(`/`, async (req, res, next) => {
    try {
        const result = User.find()
        res.json(result)
    } catch (e) {
        next(e)
    }
})

router.get(`/:account`, async (req, res, next) => {
    try {
        const { account } = req.params
        if (!startsWith0x(account)) throw new Error(`Account 가 Hex표현이 아닙니다.`)
        if (account.length !== 66) throw new Error(`Account length 가 상이합니다.`)

        const result = User.findByAccount(account)
        res.json(result)
    } catch (e) {
        next(e)
    }
})

router.post(`/`, async (req, res, next) => {
    try {
        const { account, user_id } = req.body
        if (!account || !user_id) throw new Error('요청데이터가 옳바르지 않습니다.')
        if (!startsWith0x(account)) throw new Error(`Account 가 Hex표현이 아닙니다.`)
        if (account.length !== 66) throw new Error(`Account length 가 상이합니다.`)

        await User.create({ user_id, account })
        const result = await User.findByAccount(account)
        res.json(result)
    } catch (e) {
        next(e)
    }
})

router.put(`/profile/:id`, upload.single('p_image'), async (req, res, next) => {
    try {
        if (!req.file) throw new Error('파일이 제출되지 않았습니다.')
        const { id: user_id } = req.params

        const uploadedFile = {
            originalname: req.file.originalname,
            filename: req.file.filename,
            mimetype: req.file.mimetype,
            size: req.file.size,
            destination: req.file.destination,
            path: req.file.path,
        }

        const result = await User.updateProfileByUserId({ p_image: uploadedFile.path, user_id })
        res.json(result)
    } catch (e) {
        next(e)
    }
})

module.exports = router
