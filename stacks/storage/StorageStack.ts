import {
  App,
  Bucket,
  Script,
  Stack,
  StackContext,
} from '@serverless-stack/resources';
import { getBucketNamePrefix } from '../env';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import { StoragePolicyHelper } from './BucketPolicyHelper';
import { RemovalPolicy } from 'aws-cdk-lib';

export function S3Stack({ stack, app }: StackContext) {
  const bucket = createBucket(stack, app);
  createInitBucketScript(stack, bucket, app);
}

function createBucket(stack: Stack, app: App): Bucket {
  const bucket = new Bucket(stack, 'familyBoxBucket', {
    name: `${getBucketNamePrefix()}-${stack.stage}`,
    cdk: {
      bucket: {
        encryption: s3.BucketEncryption.S3_MANAGED,
        enforceSSL: true,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        autoDeleteObjects: app.stage !== 'prod' ? true : false,
        removalPolicy:
          app.stage !== 'prod' ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,
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

  const policyStatement = new iam.PolicyStatement({
    resources: [bucket.bucketArn, `${bucket.bucketArn}/*`],
    actions: [
      's3:PutObject',
      's3:PutObjectAcl',
      's3:GetObject',
      's3:GetObjectAcl',
      's3:AbortMultipartUpload',
    ],
    effect: iam.Effect.ALLOW,
  });

  script.attachPermissions([policyStatement]);
}
