const aws = require("aws-sdk")
const multer = require("multer");
const multerS3 = require("multer-s3");
const config = require("config");


const bucketName = config.get("AWS_BUCKET");
const region = config.get("AWS_BUCKET_REGION");
const accessKeyId = config.get("AWS_ACCESS_KEY");
const secretAccessKey = config.get("AWS_SECRET_KEY");

const s3 = new aws.S3({
    region,
    accessKeyId,
    secretAccessKey
});

const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: bucketName,
      acl: 'public-read',
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        cb(null, file.originalname)
      }
    }),
    limits: {fileSize: 1000000},
    fileFilter (req, file, cb) {
      if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
        
      return cb(new Error("Please upload an image"))
      }

      cb(undefined, true)
    }
  })

const deleteFile = (key) => {
  s3.deleteObject({
    Bucket: bucketName,
    Key: key
  }, (err, data) => {
    console.log(err)
    console.log(data)
  })
}

  module.exports = {upload, deleteFile}

