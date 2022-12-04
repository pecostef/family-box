import { DefaultFoldersUtils } from '../../../common/utils/DefaultFoldersUtils';
import {
  S3Client,
  HeadObjectCommand,
  PutObjectCommand,
  S3ServiceException,
  ServerSideEncryption,
} from '@aws-sdk/client-s3';

export class BucketInitHelper {
  constructor(
    private s3Client: S3Client,
    private bucketName: string,
    private familyNames: string[]
  ) {
    this.computeFoldersToCreate.bind(this);
    this.computeFoldersForFamily.bind(this);
    this.createFolders.bind(this);
  }

  async initBucket() {
    const foldersToCreate = await this.computeFoldersToCreate();
    await this.createFolders(foldersToCreate);
  }

  private async computeFoldersForFamily(familyName: string): Promise<string[]> {
    const foldersToCreate: string[] = [];
    const currentYear = new Date().getFullYear();
    const defaultFolders = DefaultFoldersUtils.getDefaultFolders(
      familyName,
      currentYear
    );

    for (const folderPath of defaultFolders) {
      try {
        const command = new HeadObjectCommand({
          Bucket: this.bucketName,
          Key: folderPath,
        });
        await this.s3Client.send(command);
      } catch (e) {
        if (
          e instanceof S3ServiceException &&
          (e as S3ServiceException).$metadata.httpStatusCode === 404
        ) {
          foldersToCreate.push(folderPath);
        } else {
          console.error(
            'unexpected error while veryfing default folder existence',
            e
          );
        }
      }
    }
    return foldersToCreate;
  }

  private async computeFoldersToCreate(): Promise<string[]> {
    const foldersToCreate: string[] = [];

    for (let familyName of this.familyNames) {
      const folders = await this.computeFoldersForFamily(familyName);
      foldersToCreate.push(...folders);
    }

    return foldersToCreate;
  }

  private async createFolders(foldersToCreate: string[]) {
    for (const folderPath of foldersToCreate) {
      try {
        const command = new PutObjectCommand({
          Bucket: this.bucketName,
          Key: folderPath,
          ServerSideEncryption: ServerSideEncryption.AES256,
        });
        await this.s3Client.send(command);
      } catch (error) {
        console.error(`error while initializing folder: ${folderPath}`, error);
      }
    }
  }
}
