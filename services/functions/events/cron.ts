import { getFamilyBoxBucketName, getFamilyNames } from 'functions/utils/env';
import { S3Client } from '@aws-sdk/client-s3';
import { StorageConfig } from 'domain/StorageConfig';
import { S3Repository } from 'repository/S3Repository';
import { StorageService } from 'domain/StorageService';

const s3Client = new S3Client({
  apiVersion: '2006-03-01',
});
const storageConfig = new StorageConfig(getFamilyBoxBucketName());
const s3Repository = new S3Repository(s3Client);
const storageService = new StorageService(s3Repository, storageConfig);
export async function createYearlyFolders() {
  await storageService.createYearlyFolders(getFamilyNames());
}
