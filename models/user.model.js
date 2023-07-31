const pool = require('./index')

class User {
    static async find() {
        try {
            const sql = `SELECT * FROM users`
            const [rows, fields] = await pool.query(sql)

            return rows
        } catch (e) {
            throw new Error(e.message)
        }
    }

    static async findByUserId(userid) {
        try {
            const sql = 'SELECT * FROM users WHERE user_id=?'
            const [rows, fields] = await pool.query(sql, [userid])

            return rows
        } catch (e) {
            throw new Error(e.message)
        }
    }

    static async findByAccount(account) {
        try {
            const sql = 'SELECT * FROM users WHERE account=?'
            const [rows, fields] = await pool.query(sql, [account])
            if (rows.affectedRows < 1) {
                throw new Error('account 에 맞지않는 데이터가 있습니다.')
            }
            return rows
        } catch (e) {
            throw new Error(e.message)
        }
    }

    static async create({ user_id, account }) {
        try {
            const sql = `INSERT INTO users(account, user_id) values(?,?)`
            const [rows, fields] = await pool.query(sql, [account, user_id])

            if (rows.affectedRows > 1) throw new Error('해당 account 는 회원이 아닙니다.')
            return rows
        } catch (e) {
            throw new Error(e.message)
        }
    }

    static async updateProfileByUserId({ p_image, user_id }) {
        try {
            const sql = `UPDATE users SET p_image=? WHERE user_id=?`
            const [rows, fields] = await pool.query(sql, [p_image, user_id])

            return rows
        } catch (e) {
            throw new Error(e.message)
        }
    }
}

module.exports = User
