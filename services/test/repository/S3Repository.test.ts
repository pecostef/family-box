import {
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
  S3ServiceException,
} from '@aws-sdk/client-s3';
import { AwsStub, mockClient } from 'aws-sdk-client-mock';
import { beforeEach, describe, expect, it } from 'vitest';
import { S3Repository } from '../../repository/S3Repository';
describe('S3Repository', () => {
  let s3Client: AwsStub<any, any>;
  let s3Repository: S3Repository;

  describe('existsFolder', () => {
    beforeEach(() => {
      s3Client = mockClient(S3Client);
      s3Repository = new S3Repository(s3Client as unknown as S3Client);
    });
    it('returns false if the folder does not exist', async () => {
      s3Client.reset();
      s3Client.on(HeadObjectCommand).rejects(
        new S3ServiceException({
          name: '',
          $fault: 'server',
          $metadata: {
            httpStatusCode: 404,
          },
        })
      );

      const res = await s3Repository.existsFolder(
        'myBucketName',
        '/some/folder/path/'
      );
      const actualCalls = s3Client.commandCalls(HeadObjectCommand);

      expect(res).toBe(false);
      expect(actualCalls.length).toBe(1);
      expect(actualCalls[0].args[0].input).toEqual({
        Bucket: 'myBucketName',
        Key: '/some/folder/path/',
      });
    });

    it('returns true if the folder exists', async () => {
      s3Client.reset();
      s3Client.on(HeadObjectCommand).resolves({});

      const res = await s3Repository.existsFolder(
        'myBucketName',
        '/some/folder/path/'
      );
      const actualCalls = s3Client.commandCalls(HeadObjectCommand);

      expect(res).toBe(true);
      expect(actualCalls.length).toBe(1);
      expect(actualCalls[0].args[0].input).toEqual({
        Bucket: 'myBucketName',
        Key: '/some/folder/path/',
      });
    });
  });

  describe('createFolder', () => {
    beforeEach(() => {
      s3Client = mockClient(S3Client);
      s3Repository = new S3Repository(s3Client as unknown as S3Client);
    });
    it('returns nothing if folder is successfuly created', async () => {
      s3Client.reset();
      s3Client.on(PutObjectCommand).resolves({});
      await s3Repository.createFolder('myBucketName', '/some/folder/path/');
      const actualCalls = s3Client.commandCalls(PutObjectCommand);

      expect(actualCalls.length).toBe(1);
      expect(actualCalls[0].args[0].input).toEqual({
        Bucket: 'myBucketName',
        Key: '/some/folder/path/',
        ServerSideEncryption: 'AES256',
      });
    });

    it('throws if folder cannot be created', async () => {
      s3Client.reset();
      s3Client.on(PutObjectCommand).rejects();
      await expect(() =>
        s3Repository.createFolder('myBucketName', '/some/folder/path/')
      ).rejects.toThrow();

      const actualCalls = s3Client.commandCalls(PutObjectCommand);

      expect(actualCalls.length).toBe(1);
      expect(actualCalls[0].args[0].input).toEqual({
        Bucket: 'myBucketName',
        Key: '/some/folder/path/',
        ServerSideEncryption: 'AES256',
      });
    });
  });
});
