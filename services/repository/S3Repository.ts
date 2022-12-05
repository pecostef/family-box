import { FileStorageRepository } from '../domain/FileStorageRepository';
import {
  S3Client,
  HeadObjectCommand,
  PutObjectCommand,
  S3ServiceException,
  ServerSideEncryption,
} from '@aws-sdk/client-s3';

export class S3Repository implements FileStorageRepository {
  constructor(private s3Client: S3Client) {}
  async existsFolder(
    storageName: string,
    folderPath: string
  ): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: storageName,
        Key: folderPath,
      });
      await this.s3Client.send(command);
      return true;
    } catch (e) {
      if (
        e instanceof S3ServiceException &&
        (e as S3ServiceException).$metadata.httpStatusCode === 404
      ) {
        return false;
      } else {
        throw e;
      }
    }
  }
  async createFolder(storageName: string, folderPath: string): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: storageName,
      Key: folderPath,
      ServerSideEncryption: ServerSideEncryption.AES256,
    });
    await this.s3Client.send(command);
  }
}
