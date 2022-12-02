import AWS from 'aws-sdk';
import { BucketInitHelper } from './BucketInitHelper';

const s3Client = new AWS.S3({ apiVersion: '2006-03-01' });
// TODO use parameter store to pass variables around?
const familyNames = ['pecoraro-dotolo'];
export async function onBucketResourceCreate() {
  await executeInit();
}

export async function onBucketResourceUpdate() {
  await executeInit();
}

async function executeInit() {
  const helper = new BucketInitHelper(
    s3Client,
    getFamilyBoxBucketName(),
    familyNames
  );
  await helper.initBucket();
}

function getFamilyBoxBucketName(): string {
  return process.env.bucketName ?? '';
}
