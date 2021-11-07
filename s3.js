const S3 = require("aws-sdk/clients/s3");
const config = require("config");
const fs = require("fs");


const bucketName = config.get("AWS_BUCKET");
const region = config.get("AWS_BUCKET_REGION");
const accessKeyId = config.get("AWS_ACCESS_KEY");
const secretAccessKey = config.get("AWS_SECRET_KEY");

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
});

// upload a file to s3
const uploadFile = (file) => {
    const fileStream = fs.createReadStream(file.path);

    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename
    }

    return s3.upload(uploadParams).promise();
}

module.exports = uploadFile;
// downloads a file from s3