import { S3Client } from '@aws-sdk/client-s3';
import { describe, it, expect } from 'vitest';
import { StorageConfig, StorageService } from '../domain';
import {
  resolve,
  S3_CLIENT_INJ,
  FILE_STORAGE_REPO_INJ,
  STORAGE_CONFIG_INJ,
  STORAGE_SERVICE_INJ,
} from '../inject';
import { S3Repository } from '../repository/S3Repository';

describe('inject is a small utility for registering application-wide dependencies', () => {
  describe('resolve()', () => {
    it('should return a S3Client instance', () => {
      expect(resolve(S3_CLIENT_INJ)).toBeInstanceOf(S3Client);
    });

    it('should return a storage config', () => {
      expect(resolve(STORAGE_CONFIG_INJ)).toBeInstanceOf(StorageConfig);
    });

    it('should return a file storage repository implementation', () => {
      expect(resolve(FILE_STORAGE_REPO_INJ)).toBeInstanceOf(S3Repository);
    });

    it('should return the storage service', () => {
      expect(resolve(STORAGE_SERVICE_INJ)).toBeInstanceOf(StorageService);
    });
  });
});
