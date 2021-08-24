const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");
const aws = require('aws-sdk');
aws.config.region = 'ap-southeast-1';
const S3_BUCKET = process.env.S3_BUCKET;
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
const dirCodes = path.join(__dirname, "codes");
if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}
const generateFile = async (format, content) => {
  const jobId = uuid();
  const filename = `${jobId}.${format}`;
  const filepath = path.join(dirCodes, filename);
  await fs.writeFileSync(filepath, content);
  const fileURL = `https://compiler-bucket.s3.ap-southeast-1.amazonaws.com/${jobId}.${format}`
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: filename,
    Expires: 60,
    ContentType: filename,
    ACL: 'public-read',
    Body: content
  };
  s3.upload(s3Params, (err, data) => {
    if(err){
      console.log(err);
    }
    console.log(`${data.Location}`)
  });
  return filepath
};

module.exports = {
  generateFile,
};
