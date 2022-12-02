import AWS from 'aws-sdk';
import { describe, it } from 'vitest';
import { BucketInitHelper } from '../functions/storage/BucketInitHelper';

describe.skip('temp test for s3', () => {
  it('should create the folder structure', async () => {
    const s3Client = new AWS.S3({ apiVersion: '2006-03-01' });
    const helper = new BucketInitHelper(s3Client, 'familybox-dev', [
      'pecoraro-dotolo',
    ]);
    await helper.initBucket();
  });
});
