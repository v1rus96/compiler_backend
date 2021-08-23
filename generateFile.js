const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");
var url = require('url');
const aws = require('aws-sdk');
aws.config.region = 'ap-southeast-1';
const S3_BUCKET = process.env.S3_BUCKET;
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const generateFile = async (format, content) => {
  const jobId = uuid();
  var urlR
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: `${jobId}.${format}`,
    Expires: 60,
    ContentType: `${jobId}.${format}`,
    ACL: 'public-read',
    Body: content
  };
  s3.upload(s3Params, (err, data) => {
    if(err){
      console.log(err);
    }
    console.log(`${data.Location}`)
     urlR = url.parse(`${data.Location}`, true);
  });
  console.log("URL:" + urlR)
  return urlR
};

module.exports = {
  generateFile,
};
