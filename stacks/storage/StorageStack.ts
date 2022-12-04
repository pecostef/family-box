import {
  App,
  Bucket,
  Script,
  Stack,
  StackContext,
} from '@serverless-stack/resources';
import {
  getBucketNamePrefix,
  getFamilyNames,
  getFamilyNamesAsArray,
} from '../env';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import { BucketPolicyHelper } from './BucketPolicyHelper';
import * as cdk from 'aws-cdk-lib';
import { DefaultFoldersUtils } from '../../common/utils';

export function S3Stack({ stack, app }: StackContext) {
  const bucket = createBucket(stack, app);
  createInitBucketScript(stack, bucket, app);
}

function createBucket(stack: Stack, app: App): Bucket {
  const bucket = new Bucket(stack, 'familyBoxBucket', {
    name: `${getBucketNamePrefix()}-${stack.stage}`,
    cdk: {
      bucket: {
        lifecycleRules: [
          createAbortMultipartUploadLifeCycleRule(),
          ...createBillsAndReceiptsLifecyclePolicies(),
          ...createFinancialRecordsLifecyclePolicies(),
        ],
        encryption: s3.BucketEncryption.S3_MANAGED,
        enforceSSL: app.stage !== 'prod' ? true : false,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        autoDeleteObjects: app.stage !== 'prod' ? true : false,
        removalPolicy:
          app.stage !== 'prod'
            ? cdk.RemovalPolicy.DESTROY
            : cdk.RemovalPolicy.RETAIN,
      },
    },
  });
  const helper = new BucketPolicyHelper(stack, bucket);
  bucket.cdk.bucket.policy = helper.createBucketPolicy();
  return bucket;
}

function createAbortMultipartUploadLifeCycleRule(): s3.LifecycleRule {
  return {
    id: 'AbortMultipartUpload',
    abortIncompleteMultipartUploadAfter: cdk.Duration.days(90),
  };
}

function createBillsAndReceiptsLifecyclePolicies(): s3.LifecycleRule[] {
  const policies: s3.LifecycleRule[] = [];
  for (const familyName of getFamilyNamesAsArray()) {
    policies.push({
      id: `BillsAndReceiptsLifecyclePolicies_${familyName}`,
      prefix: DefaultFoldersUtils.getBillingAndReceiptsFolderPrefix(familyName),
      expiration: cdk.Duration.days(2 * 365),
      transitions: [
        {
          storageClass: s3.StorageClass.INFREQUENT_ACCESS,
          transitionAfter: cdk.Duration.days(30),
        },
        {
          storageClass: s3.StorageClass.GLACIER,
          transitionAfter: cdk.Duration.days(3 * 30),
        },
      ],
    });
  }
  return policies;
}

function createFinancialRecordsLifecyclePolicies(): s3.LifecycleRule[] {
  const policies: s3.LifecycleRule[] = [];
  for (const familyName of getFamilyNamesAsArray()) {
    policies.push({
      id: `FinancialRecordsLifecyclePolicies_${familyName}`,
      prefix: DefaultFoldersUtils.getFinancialRecordsFolderPrefix(familyName),
      transitions: [
        {
          storageClass: s3.StorageClass.INFREQUENT_ACCESS,
          transitionAfter: cdk.Duration.days(365),
        },
        {
          storageClass: s3.StorageClass.GLACIER,
          transitionAfter: cdk.Duration.days(2 * 365),
        },
        {
          storageClass: s3.StorageClass.DEEP_ARCHIVE,
          transitionAfter: cdk.Duration.days(4 * 365),
        },
      ],
    });
  }
  return policies;
}

function createInitBucketScript(stack: Stack, bucket: Bucket, app: App) {
  const script = new Script(stack, 'familyBoxBucketScript', {
    defaults: {
      function: {
        srcPath: 'services/functions/storage/',
        environment: {
          bucketName: bucket.bucketName,
          familyNames: getFamilyNames(),
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
      's3:ListBucket',
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
