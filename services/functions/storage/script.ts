import { S3Client } from '@aws-sdk/client-s3';
import { getFamilyBoxBucketName, getFamilyNames } from 'functions/utils/env';
import { StorageConfig } from 'domain/StorageConfig';
import { StorageService } from 'domain/StorageService';
import { S3Repository } from 'repository/S3Repository';
const s3Client = new S3Client({
  apiVersion: '2006-03-01',
});
const storageConfig = new StorageConfig(getFamilyBoxBucketName());
const s3Repository = new S3Repository(s3Client);
const storageService = new StorageService(s3Repository, storageConfig);
export async function onBucketResourceCreate() {
  await executeInit();
}

export async function onBucketResourceUpdate() {
  await executeInit();
}

async function executeInit() {
  await storageService.initializeStorage(getFamilyNames());
}
