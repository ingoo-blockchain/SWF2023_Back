require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const PORT = process.env.SERVER_PORT || 3005
const router = require('./routes/index')
const connection = require('./model/index')
const path = require('path')

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

app.use(router)

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err)
        return
    }
    console.log('Connected to MySQL database!')
})

app.listen(PORT, () => {
    console.log(`server start ${PORT}`)
})
