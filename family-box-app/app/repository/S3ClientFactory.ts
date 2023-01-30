import { S3Client } from '@aws-sdk/client-s3';
import { AwsCredentialIdentity } from '@aws-sdk/types';
import { getBucketRegion } from '../env';

export class S3ClientFactory {
  create = (credentials: AwsCredentialIdentity) => {
    if (!credentials) {
      throw new Error('Unauthorized');
    }
    return new S3Client({
      region: getBucketRegion(),
      credentials,
    });
  };
}
