import aws from 'aws-sdk'
import { randomBytes } from 'crypto';
import dotenv from 'dotenv';

dotenv.config()

const region = "eu-north-1"
const bucketName = process.env.S3_BUCKET_NAME
const accessKeyId = process.env.S3_ACCESS_KEY
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY

const s3 = new aws.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: 'v4',
    cors: true
})

export default async function generateUploadURL() {
    const rawBytes = await randomBytes(16);
    const imageName = rawBytes.toString('hex');

    const params = {
        Bucket: bucketName,
        Key: imageName,
        Expires: 60,
        ACL: 'public-read',
        ContentType: 'application/octet-stream',
        Metadata: {
            'access-control-allow-origin': 'http://localhost:5173'
        },
        ResponseHeaders: {
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Access-Control-Allow-Methods': 'GET, PUT, POST, HEAD',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Expose-Headers': 'ETag',
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': 'attachment'
        }
    };

    const uploadURL = await s3.getSignedUrlPromise('putObject', params);
    return uploadURL;
}

