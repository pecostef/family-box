import {
  App,
  Bucket,
  Script,
  Stack,
  StackContext,
} from '@serverless-stack/resources';
import { getBucketNamePrefix } from '../env';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { StoragePolicyHelper } from './BucketPolicyHelper';

export function S3Stack({ stack, app }: StackContext) {
  const bucket = createBucket(stack);
  createInitBucketScript(stack, bucket, app);
}

function createBucket(stack: Stack): Bucket {
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
  const helper = new StoragePolicyHelper(stack, bucket);
  bucket.cdk.bucket.policy = helper.createBucketPolicy();
  return bucket;
}

function createInitBucketScript(stack: Stack, bucket: Bucket, app: App) {
  const script = new Script(stack, 'familyBoxBucketScript', {
    defaults: {
      function: {
        srcPath: 'services/functions/storage/',
        environment: {
          bucketName: bucket.bucketName,
        },
        logRetention: 'two_weeks',
      },
    },
    onCreate: {
      handler: 'script.onBucketResourceCreate',
      functionName: app.logicalPrefixedName('onBucketResourceCreate'),
    },
    onUpdate: {
      handler: 'script.onBucketResourceUpdate',
      functionName: app.logicalPrefixedName('onBucketResourceUpdate'),
    },
  });
  script.attachPermissions(['s3']);
}
