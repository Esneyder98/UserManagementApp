const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve(__dirname, '../../public/img/'));
    },
    filename: (req, file, cb) => {
        let fileName = `imageUser-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, fileName);
    }
});

const uploadFile = multer({storage});

module.exports = uploadFile;