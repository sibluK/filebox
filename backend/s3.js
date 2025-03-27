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
    useAccelerateEndpoint: true,
    httpOptions: {
        headers: {
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Access-Control-Allow-Methods': 'GET, PUT, POST, HEAD',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Expose-Headers': 'ETag, x-amz-server-side-encryption, x-amz-request-id, x-amz-id-2'
        }
    }
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
        CORSRule: {
            AllowedHeaders: ['*'],
            AllowedMethods: ['GET', 'PUT', 'POST', 'HEAD'],
            AllowedOrigins: ['http://localhost:5173'],
            ExposeHeaders: ['ETag', 'x-amz-server-side-encryption', 'x-amz-request-id', 'x-amz-id-2']
        }
    };

    const uploadURL = await s3.getSignedUrlPromise('putObject', params);
    return uploadURL;
}