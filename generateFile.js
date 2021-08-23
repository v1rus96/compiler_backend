const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");
const aws = require('aws-sdk');
aws.config.region = 'ap-southeast-1';
const S3_BUCKET = process.env.S3_BUCKET;

const generateFile = async (format, content) => {
  const jobId = uuid();
  const s3 = new aws.S3();
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: `${jobId}`,
    Expires: 60,
    ContentType: `${format}`,
    ACL: 'public-read'
  };
  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
    }
    return `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
  });
};

module.exports = {
  generateFile,
};
