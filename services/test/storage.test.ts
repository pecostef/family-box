import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BucketInitHelper } from '../functions/storage/BucketInitHelper';
import {
  S3Client,
  HeadObjectCommand,
  PutObjectCommand,
  S3ServiceException,
} from '@aws-sdk/client-s3';
import { mockClient, AwsStub } from 'aws-sdk-client-mock';

describe('BucketInitHelper', () => {
  let s3Client: AwsStub<any, any>;
  let helper: BucketInitHelper;
  beforeEach(() => {
    s3Client = mockClient(S3Client);
  });
  describe('initBucket', () => {
    beforeEach(() => {
      const date = new Date(2023, 1, 1);
      vi.setSystemTime(date);
      helper = new BucketInitHelper(
        s3Client as unknown as S3Client,
        'my-bucket',
        ['my-family', 'my-parents-family']
      );
    });
    describe('if default folders are not present on the S3 bucket', () => {
      beforeEach(() => {
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
        s3Client.on(PutObjectCommand).resolves({});
      });
      it('should call headObject for each of the default folder', async () => {
        await helper.initBucket();

        const actualCalls = s3Client.commandCalls(HeadObjectCommand);

        expect(actualCalls.length).toBe(20);
        expect(actualCalls[0].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-family/vital-records/',
        });
        expect(actualCalls[1].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-family/passports+identification/',
        });
        expect(actualCalls[2].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-family/will+deeds/',
        });
        expect(actualCalls[3].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-family/medical-records/',
        });
        expect(actualCalls[4].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-family/policies/',
        });
        expect(actualCalls[5].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-family/financial-records/2023/',
        });
        expect(actualCalls[6].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-family/employment+educational/',
        });
        expect(actualCalls[7].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-family/passwords/',
        });
        expect(actualCalls[8].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-family/bills+receipts/2023/',
        });
        expect(actualCalls[9].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-family/home-documents/',
        });

        expect(actualCalls[10].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-parents-family/vital-records/',
        });
        expect(actualCalls[11].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-parents-family/passports+identification/',
        });
        expect(actualCalls[12].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-parents-family/will+deeds/',
        });
        expect(actualCalls[13].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-parents-family/medical-records/',
        });
        expect(actualCalls[14].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-parents-family/policies/',
        });
        expect(actualCalls[15].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-parents-family/financial-records/2023/',
        });
        expect(actualCalls[16].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-parents-family/employment+educational/',
        });
        expect(actualCalls[17].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-parents-family/passwords/',
        });
        expect(actualCalls[18].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-parents-family/bills+receipts/2023/',
        });
        expect(actualCalls[19].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-parents-family/home-documents/',
        });
      });

      it('should call putObject for each of the default folder', async () => {
        await helper.initBucket();

        const actualCalls = s3Client.commandCalls(PutObjectCommand);

        expect(actualCalls.length).toBe(20);
        expect(actualCalls[0].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-family/vital-records/',
          ServerSideEncryption: 'AES256',
        });
        expect(actualCalls[1].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-family/passports+identification/',
          ServerSideEncryption: 'AES256',
        });
        expect(actualCalls[2].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-family/will+deeds/',
          ServerSideEncryption: 'AES256',
        });
        expect(actualCalls[3].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-family/medical-records/',
          ServerSideEncryption: 'AES256',
        });
        expect(actualCalls[4].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-family/policies/',
          ServerSideEncryption: 'AES256',
        });
        expect(actualCalls[5].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-family/financial-records/2023/',
          ServerSideEncryption: 'AES256',
        });
        expect(actualCalls[6].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-family/employment+educational/',
          ServerSideEncryption: 'AES256',
        });
        expect(actualCalls[7].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-family/passwords/',
          ServerSideEncryption: 'AES256',
        });
        expect(actualCalls[8].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-family/bills+receipts/2023/',
          ServerSideEncryption: 'AES256',
        });
        expect(actualCalls[9].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-family/home-documents/',
          ServerSideEncryption: 'AES256',
        });

        expect(actualCalls[10].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-parents-family/vital-records/',
          ServerSideEncryption: 'AES256',
        });
        expect(actualCalls[11].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-parents-family/passports+identification/',
          ServerSideEncryption: 'AES256',
        });
        expect(actualCalls[12].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-parents-family/will+deeds/',
          ServerSideEncryption: 'AES256',
        });
        expect(actualCalls[13].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-parents-family/medical-records/',
          ServerSideEncryption: 'AES256',
        });
        expect(actualCalls[14].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-parents-family/policies/',
          ServerSideEncryption: 'AES256',
        });
        expect(actualCalls[15].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-parents-family/financial-records/2023/',
          ServerSideEncryption: 'AES256',
        });
        expect(actualCalls[16].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-parents-family/employment+educational/',
          ServerSideEncryption: 'AES256',
        });
        expect(actualCalls[17].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-parents-family/passwords/',
          ServerSideEncryption: 'AES256',
        });
        expect(actualCalls[18].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-parents-family/bills+receipts/2023/',
          ServerSideEncryption: 'AES256',
        });
        expect(actualCalls[19].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-parents-family/home-documents/',
          ServerSideEncryption: 'AES256',
        });
      });
    });

    describe('if default folders are present on the S3 bucket', () => {
      beforeEach(() => {
        s3Client.reset();
        s3Client.on(HeadObjectCommand).resolves({});
      });
      it('should call headObject for each of the default folder', async () => {
        await helper.initBucket();

        const actualCalls = s3Client.commandCalls(HeadObjectCommand);

        expect(actualCalls.length).toBe(20);
        expect(actualCalls[0].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-family/vital-records/',
        });
        expect(actualCalls[1].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-family/passports+identification/',
        });
        expect(actualCalls[2].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-family/will+deeds/',
        });
        expect(actualCalls[3].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-family/medical-records/',
        });
        expect(actualCalls[4].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-family/policies/',
        });
        expect(actualCalls[5].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-family/financial-records/2023/',
        });
        expect(actualCalls[6].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-family/employment+educational/',
        });
        expect(actualCalls[7].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-family/passwords/',
        });
        expect(actualCalls[8].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-family/bills+receipts/2023/',
        });
        expect(actualCalls[9].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-family/home-documents/',
        });

        expect(actualCalls[10].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-parents-family/vital-records/',
        });
        expect(actualCalls[11].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-parents-family/passports+identification/',
        });
        expect(actualCalls[12].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-parents-family/will+deeds/',
        });
        expect(actualCalls[13].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-parents-family/medical-records/',
        });
        expect(actualCalls[14].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-parents-family/policies/',
        });
        expect(actualCalls[15].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-parents-family/financial-records/2023/',
        });
        expect(actualCalls[16].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-parents-family/employment+educational/',
        });
        expect(actualCalls[17].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-parents-family/passwords/',
        });
        expect(actualCalls[18].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-parents-family/bills+receipts/2023/',
        });
        expect(actualCalls[19].args[0].input).toEqual({
          Bucket: 'my-bucket',
          Key: '/home/my-parents-family/home-documents/',
        });
      });

      it('should not call putObject at all', async () => {
        await helper.initBucket();

        const actualCalls = s3Client.commandCalls(PutObjectCommand);

        expect(actualCalls.length).toBe(0);
      });
    });
  });
});
