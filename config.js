require('dotenv').config()

const { NODE_ENV } = process.env
const isDev = NODE_ENV === 'development'
const SERVER_POST = isDev ? '3005' : '80'

const baseURL = isDev ? 'http://127.0.0.1:4000' : 'https://api.develrocket.com'

const DB_HOST = isDev ? '127.0.0.1' : process.env.DB_HOST
const DB_USER = isDev ? 'root' : process.env.DB_USER
const DB_PASSWORD = isDev ? 'root' : process.env.DB_PASSWORD
const DATABASE = isDev ? 'LTL' : process.env.DB_DATABASE

const s3url = `https://develrocket-test.s3.ap-northeast-2.amazonaws.com`

module.exports = {
    SERVER_POST,
    isDev,
    baseURL,
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DATABASE,
    s3url,
}
