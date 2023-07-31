const mysql = require('mysql2')
const { DB_HOST, DB_USER, DB_PASSWORD, DATABASE } = require('../config')

const host = DB_HOST || '127.0.0.1'
const user = DB_USER || 'root'
const password = DB_PASSWORD || 'root'
const database = DATABASE || 'LTL'

const connection = mysql.createConnection({
    host,
    user,
    password,
    database,
})

module.exports = connection
