const express = require('express')
const router = express.Router()
const connection = require('../../model/index')
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/') // 업로드된 파일이 저장될 폴더 지정
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        const extension = path.extname(file.originalname)
        cb(null, file.fieldname + '-' + uniqueSuffix + extension)
    },
})

const upload = multer({ storage: storage })

router.get(`/`, (req, res) => {
    const query = 'SELECT * FROM users'

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err)
            return res.status(500).json({ error: 'Error fetching data from the database' })
        }

        res.json(results)
    })
})

router.post(`/`, (req, res) => {
    const { account, user_id } = req.body

    try {
        if (!account || !user_id) throw new Error('Account 나 유저아이디가 비어있습니다.')

        const query = `INSERT INTO users(account, user_id) values('${account}','${user_id}')`
        connection.query(query, (err, results) => {
            if (err) {
                console.error('Error executing MySQL query:', err)
                return res.status(500).json({ error: 'Error fetching data from the database' })
            }

            res.json(results)
        })
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
})

router.put(`/profile/:id`, upload.single('p_image'), (req, res) => {
    try {
        if (!req.file) throw new Error('파일이 제출되지 않았습니다.')

        const { id: user_id } = req.params

        // 업로드된 파일의 정보 반환
        const uploadedFile = {
            originalname: req.file.originalname,
            filename: req.file.filename,
            mimetype: req.file.mimetype,
            size: req.file.size,
            destination: req.file.destination,
            path: req.file.path,
        }

        const query = `UPDATE users SET p_image='${uploadedFile.path}' WHERE user_id='${user_id}'`
        console.log(query)
        connection.query(query, (err, results) => {
            if (err) {
                console.error('Error executing MySQL query:', err)
                return res.status(500).json({ error: 'Error fetching data from the database' })
            }

            res.json(results)
        })
    } catch (e) {
        res.status(400).send('error')
    }
})

module.exports = router
