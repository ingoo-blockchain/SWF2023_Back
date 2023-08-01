require('dotenv').config()

const { NODE_ENV } = process.env
const isDev = NODE_ENV === 'development'
const SERVER_POST = isDev ? '3005' : '80'

const baseURL = isDev ? 'http://127.0.0.1:4000' : 'https://api.develrocket.com'

const DB_HOST = isDev ? '127.0.0.1' : process.env.DB_HOST
const DB_USER = isDev ? 'root' : process.env.DB_USER
const DB_PASSWORD = isDev ? 'root' : process.env.DB_PASSWORD
const DATABASE = isDev ? 'LTL' : process.env.DB_DATABASE
const MYHOST = isDev ? 'http://127.0.0.1:8080' : 'http://3.36.177.186'

const {
    ADMIN_ADDRESS,
    ADMIN_PRIVATE_KEY,
    ALCHEMY_URL,
    ALCHEMY_GOERLI_API_KEY,
    GOERLI_GOVERNANCE_TOKEN,
    GOERLI_GOVERNOR,
    GOERLI_POSTING,
    PINATA_API_KEY,
    PINATA_API_SECRET,
    PINATA_JWT,
    IPFS_URL,
} = process.env

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
    ADMIN_ADDRESS,
    ADMIN_PRIVATE_KEY,
    ALCHEMY_URL,
    ALCHEMY_GOERLI_API_KEY,
    GOERLI_GOVERNANCE_TOKEN,
    GOERLI_GOVERNOR,
    GOERLI_POSTING,
    PINATA_API_KEY,
    PINATA_API_SECRET,
    PINATA_JWT,
    MYHOST,
    IPFS_URL,
}
