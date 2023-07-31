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

module.exports = upload
