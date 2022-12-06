import { S3Client } from '@aws-sdk/client-s3';
import { StorageService } from './domain';
import { StorageConfig } from './domain/StorageConfig';
import { getFamilyBoxBucketName } from './functions/utils/env';
import { S3Repository } from './repository/S3Repository';
export const STORAGE_CONFIG_INJ = 'storageConfig';
export const S3_CLIENT_INJ = 's3Client';
export const FILE_STORAGE_REPO_INJ = 'fileStorageRepository';
export const STORAGE_SERVICE_INJ = 'storageService';

class Container {
  private instances = new Map();

  register<T>(token: string, instance: T) {
    this.instances.set(token, instance);
  }

  resolve<T>(token: string): T {
    return this.instances.get(token) as T;
  }
}

const s3Client = new S3Client({
  apiVersion: '2006-03-01',
});
const storageConfig = new StorageConfig(getFamilyBoxBucketName());
const s3Repository = new S3Repository(s3Client);
const storageService = new StorageService(s3Repository, storageConfig);

const container = new Container();
container.register(S3_CLIENT_INJ, s3Client);
container.register(STORAGE_CONFIG_INJ, storageConfig);
container.register(FILE_STORAGE_REPO_INJ, s3Repository);
container.register(STORAGE_SERVICE_INJ, storageService);

export function resolve<T>(token: string) {
  return container.resolve(token) as T;
}
