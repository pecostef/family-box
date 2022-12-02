import { Bucket, Stack } from '@serverless-stack/resources';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
export class StoragePolicyHelper {
  constructor(private stack: Stack, private bucket: Bucket) {}

  createBucketPolicy(): s3.BucketPolicy {
    const policy = new s3.BucketPolicy(this.stack, 'FamilyBoxBucketPolicy', {
      bucket: this.bucket.cdk.bucket,
    });
    policy.document.addStatements(
      this.createDenyIncorrectEncryptionHeaderStatement(this.bucket),
      this.createDenyUnEncryptedObjectUploadsStatement(this.bucket),
      this.createDenyNonSSLRequestsStatement(this.bucket)
    );
    return policy;
  }

  private getAnyPrincipal(): iam.IPrincipal {
    return new iam.StarPrincipal();
  }

  private createDenyIncorrectEncryptionHeaderStatement(bucket: Bucket) {
    return new iam.PolicyStatement({
      sid: 'DenyIncorrectEncryptionHeader',
      principals: [this.getAnyPrincipal()],
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

  private createDenyUnEncryptedObjectUploadsStatement(bucket: Bucket) {
    return new iam.PolicyStatement({
      sid: 'DenyUnEncryptedObjectUploads',
      principals: [this.getAnyPrincipal()],
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

  private createDenyNonSSLRequestsStatement(bucket: Bucket) {
    return new iam.PolicyStatement({
      sid: 'DenyNonSSLRequests',
      notPrincipals: [new iam.ServicePrincipal('lambda.amazonaws.com')],
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
}
