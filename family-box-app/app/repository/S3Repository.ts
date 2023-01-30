import {
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3ServiceException,
  ServerSideEncryption,
} from '@aws-sdk/client-s3';
import { AwsCredentialIdentity } from '@aws-sdk/types';
import { User } from '../domain';
import { StorageRepository } from '../domain/StorageRepository';
import { S3ClientFactory } from './S3ClientFactory';
export class S3Repository implements StorageRepository {
  constructor(
    private bucketName: string,
    private s3ClientFactory: S3ClientFactory
  ) {}

  createFolder = async (user: User, path: string): Promise<boolean> => {
    const s3Client = this.s3ClientFactory.create(
      user.storageCredentials as AwsCredentialIdentity
    );
    const folderKey = this.sanitizeFolderPath(path);
    const putObjCommad = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: folderKey,
      ServerSideEncryption: ServerSideEncryption.AES256,
    });
    const res = await s3Client.send(putObjCommad);
    return true;
  };

  existsFolder = async (user: User, folderPath: string): Promise<boolean> => {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: folderPath,
      });
      const s3Client = this.s3ClientFactory.create(
        user.storageCredentials as AwsCredentialIdentity
      );

      await s3Client.send(command);
      return true;
    } catch (e) {
      console.log('existsFolder', e);
      if (
        e instanceof S3ServiceException &&
        (e as S3ServiceException).$metadata.httpStatusCode === 404
      ) {
        return false;
      } else {
        throw e;
      }
    }
  };

  listFolder = async (user: User, folderPath: string): Promise<any> => {
    const command = new ListObjectsV2Command({
      Bucket: this.bucketName,
      Prefix: folderPath,
      Delimiter: '/',
    });
    const s3Client = this.s3ClientFactory.create(
      user.storageCredentials as AwsCredentialIdentity
    );

    const res = await s3Client.send(command);
    return res;
  };

  private sanitizeFolderPath = (folderPath: string): string => {
    if (folderPath.endsWith('/')) {
      return folderPath;
    }

    return folderPath.concat('/');
  };
}
