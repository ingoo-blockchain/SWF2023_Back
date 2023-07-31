const mysql = require('mysql2')

const host = process.env.DB_HOST || '127.0.0.1'
const user = process.env.DB_USER || 'root'
const password = process.env.DB_PASSWORD || 'root'
const database = process.env.DB_DATABASE || 'LTL'

const connection = mysql.createConnection({
    host,
    user,
    password,
    database,
})

module.exports = connection
