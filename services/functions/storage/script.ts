import { BucketInitHelper } from './BucketInitHelper';
import { S3Client } from '@aws-sdk/client-s3';
const s3Client = new S3Client({
  apiVersion: '2006-03-01',
});

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
    getFamilyNames()
  );
  await helper.initBucket();
}

function getFamilyBoxBucketName(): string {
  return process.env.bucketName ?? '';
}

// familyNames env variable example: "family1, family"
function getFamilyNames(): string[] {
  return process.env.familyNames?.trim()?.split(',') ?? [];
}
