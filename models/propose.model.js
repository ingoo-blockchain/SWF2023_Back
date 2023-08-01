const pool = require('./index')

// proposal_id
// account
class Propose {
    static async find(page, limit, status) {
        try {
            const sql = `SELECT * FROM propose WHERE status=? LIMIT ?,?`
            const [rows, fields] = await pool.query(sql, [status, (page - 1) * limit, limit * page])

            return rows
        } catch (e) {
            throw new Error(e.message)
        }
    }

    static async findByAccount(account) {
        try {
            const sql = 'SELECT * FROM propse WHERE account=?'
            const [rows, fields] = await pool.query(sql, [account])

            return rows
        } catch (e) {
            throw new Error(e.message)
        }
    }

    static async findByProposalId(proposal_id, status) {
        try {
            const sql = 'SELECT * FROM propse WHERE proposal_id=? AND status=?'
            const [rows, fields] = await pool.query(sql, [proposal_id, status])

            return rows
        } catch (e) {
            throw new Error(e.message)
        }
    }

    static async findByUnique({ uuid, account }) {
        try {
            const sql = `SELECT * FROM propose WHERE account=? AND uuid=?`
            const [rows, fields] = await pool.query(sql, [account, uuid])
            return rows
        } catch (e) {
            throw new Error(e.message)
        }
    }

    static async findByIpfsHash(IpfsHash) {
        try {
            const sql = `SELECT * FROM propose WHERE IpfsHash=?`
            const [rows, fields] = await pool.query(sql, [IpfsHash])
            return rows
        } catch (e) {
            throw new Error(e.message)
        }
    }

    static async create({ account, uuid, IpfsHash }) {
        try {
            const sql = `INSERT INTO propose(account, uuid,IpfsHash) values(?, ?, ?)`
            const [rows, fields] = await pool.query(sql, [account, uuid, IpfsHash])

            if (!rows.affectedRows) {
                throw new Error('Proposal 이 등록되지 않았습니다.')
            }

            const [result] = await Propose.findByUnique({ uuid, account })

            return result
        } catch (e) {
            throw new Error(e.message)
        }
    }

    static async updateByUUID(proposal_id, uuid) {
        try {
            const sql = `UPDATE propose SET proposal_id=? WHERE uuid=?`

            const [rows, fields] = await pool.query(sql, [proposal_id, uuid])
            return rows
        } catch (e) {
            throw new Error(e.message)
        }
    }

    static async updateAccountByProposalId({ user_id, proposal_id }) {
        try {
            const sql = `UPDATE users SET user_id=? WHERE proposal_id=?`
            const [rows, fields] = await pool.query(sql, [user_id, proposal_id])

            return rows
        } catch (e) {
            throw new Error(e.message)
        }
    }

    static async updateProposalIdByAccount({ user_id, proposal_id }) {
        try {
            const sql = `UPDATE users SET proposal_id=? WHERE user_id=?`
            const [rows, fields] = await pool.query(sql, [proposal_id, user_id])

            return rows
        } catch (e) {
            throw new Error(e.message)
        }
    }

    static async proposalState(proposal_id) {
        try {
            const sql = `UPDATE proposal SET status=1 WHERE proposal_id=?`
            const [rows, fields] = await pool.query(sql, [proposal_id])

            return rows
        } catch (e) {
            throw new Error(e.message)
        }
    }
}

module.exports = Propose
