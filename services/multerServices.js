const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const callBackHandler = (req, res, err, next) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).send({ success: false, message: err.message });
    } else if (err) {
      return res.status(422).send({ success: false, message: err.message });
    }
    return next();
};

const multipleUploads = (fieldName) => function (req, res, next) {
    return upload.fields([
        { name: fieldName, maxCount: 10 }
    ])
    (req, res, (err) => {
      callBackHandler(req, res, err, next);
    });
}

module.exports = {
    upload:upload,
    multipleUploads: multipleUploads
};
