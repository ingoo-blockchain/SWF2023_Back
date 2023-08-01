require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const PORT = process.env.SERVER_PORT || 3005
const router = require('./routes/index')
const pool = require('./models/index')
const path = require('path')
const { governor } = require('./utils/ethers')
const Proposal = require('./models/propose.model')

governor.on('ProposalExecuted', (profosalId) => {
    Proposal.updateState(profosalId)
})

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

app.use(router)
;(async () => {
    try {
        const connection = await pool.getConnection()

        console.log('Connected to the database!')

        connection.release()
    } catch (err) {
        console.error('Error while connecting to the database:', err)
        connection.end()
    }
})()

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(400).json({ error: err.message })
})

app.listen(PORT, () => {
    console.log(`server start ${PORT}`)
})
