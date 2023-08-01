const User = require('../models/user.model')
const startsWith0x = require('../utils/startWith0x')

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization

        if (!token || !token.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized: Missing or Invalid Account' })
        }

        const account = token.split(' ')[1]

        if (!startsWith0x(account)) throw new Error(`Account 가 Hex표현이 아닙니다.`)
        if (account.length !== 42) throw new Error(`Account length 가 상이합니다.`)

        const [user] = await User.findByAccount(account)

        req.user = user
        next()
    } catch (e) {
        return res.status(401).json({ error: e.message })
    }
}
