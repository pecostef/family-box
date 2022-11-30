import { Bucket, Stack, StackContext } from '@serverless-stack/resources';
import * as iam from 'aws-cdk-lib/aws-iam';
import { IPrincipal } from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { getBucketNamePrefix } from './env';

export function S3Stack({ stack }: StackContext) {
  const bucket = new Bucket(stack, 'familyBoxBucket', {
    name: `${getBucketNamePrefix()}-${stack.stage}`,
    cdk: {
      bucket: {
        encryption: s3.BucketEncryption.S3_MANAGED,
        enforceSSL: true,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      },
    },
  });
  bucket.cdk.bucket.policy = createBucketPolicy(stack, bucket);
}

function createBucketPolicy(stack: Stack, bucket: Bucket): s3.BucketPolicy {
  const policy = new s3.BucketPolicy(stack, 'FamilyBoxBucketPolicy', {
    bucket: bucket.cdk.bucket,
  });
  policy.document.addStatements(
    createDenyIncorrectEncryptionHeaderStatement(bucket),
    createDenyUnEncryptedObjectUploadsStatement(bucket),
    createDenyNonSSLRequestsStatement(bucket)
  );
  return policy;
}

function getAnyPrincipal(): IPrincipal {
  return new iam.StarPrincipal();
}

function createDenyIncorrectEncryptionHeaderStatement(bucket: Bucket) {
  return new iam.PolicyStatement({
    sid: 'DenyIncorrectEncryptionHeader',
    principals: [getAnyPrincipal()],
    actions: ['s3:PutObject'],
    effect: iam.Effect.DENY,
    resources: [`arn:aws:s3:::${bucket.bucketName}/*`],
    conditions: {
      StringNotEquals: {
        's3:x-amz-server-side-encryption': 'AES256',
      },
    },
  });
}

function createDenyUnEncryptedObjectUploadsStatement(bucket: Bucket) {
  return new iam.PolicyStatement({
    sid: 'DenyUnEncryptedObjectUploads',
    principals: [getAnyPrincipal()],
    actions: ['s3:PutObject'],
    effect: iam.Effect.DENY,
    resources: [`arn:aws:s3:::${bucket.bucketName}/*`],
    conditions: {
      Null: {
        's3:x-amz-server-side-encryption': 'true',
      },
    },
  });
}

function createDenyNonSSLRequestsStatement(bucket: Bucket) {
  return new iam.PolicyStatement({
    sid: 'DenyNonSSLRequests',
    principals: [getAnyPrincipal()],
    actions: ['s3:*'],
    effect: iam.Effect.DENY,
    resources: [`arn:aws:s3:::${bucket.bucketName}/*`],
    conditions: {
      Bool: {
        'aws:SecureTransport': 'false',
      },
    },
  });
}
