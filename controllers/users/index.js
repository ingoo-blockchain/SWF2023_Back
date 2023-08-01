const express = require('express')
const router = express.Router()
const upload = require('../../routes/upload')
const startsWith0x = require('../../utils/startWith0x')
const User = require('../../models/user.model')
const createRandomUserId = require('../../utils/randomText')
const { createSigner, provider, transferGovernanceToken } = require('../../utils/ethers')
const { ADMIN_PRIVATE_KEY } = require('../../config')

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
        if (account.length !== 42) throw new Error(`Account length 가 상이합니다.`)

        const result = User.findByAccount(account)
        res.json(result)
    } catch (e) {
        next(e)
    }
})

// 회원가입
router.post(`/`, async (req, res, next) => {
    try {
        const { account } = req.body
        console.log(req.body)
        if (!account) throw new Error('요청데이터가 옳바르지 않습니다.')
        if (!startsWith0x(account)) throw new Error(`Account 가 Hex표현이 아닙니다.`)
        if (account.length !== 42) throw new Error(`Account length 가 상이합니다.`)

        // 이미 가입된 Account 확인용
        const [user] = await User.findByAccount(account)

        // 처음 접속하는경우
        if (!user) {
            console.info(`Create User`)
            await User.create({ user_id: createRandomUserId(18), account })
            const result = await User.findByAccount(account)

            // Singer 만들기
            const signer = createSigner(ADMIN_PRIVATE_KEY, provider)
            await transferGovernanceToken(signer, account, 1)
            res.status(201).json({ result, isNew: true })
        } else {
            res.status(200).json({ user, isNew: false })
        }
    } catch (e) {
        next(e)
    }
})

router.put(`/:id`, async (req, res, next) => {
    try {
        const { id: account } = req.params
        const { user_id } = req.body
        const result = User.update({ user_id, account })

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

        const profileUpload = await User.updateProfileByUserId({ p_image: uploadedFile.path, user_id })
        if (!profileUpload.affectedRows) {
            // 업로드가 실패되었을때
            throw new Error('upload 가 실패되었습니다.')
        }

        const [user] = await User.findByUserId(user_id)
        res.json({ p_image: user.p_image })
    } catch (e) {
        next(e)
    }
})

module.exports = router
