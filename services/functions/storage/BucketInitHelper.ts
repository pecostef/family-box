import AWS from 'aws-sdk';
import { applyTemplate } from '../utils';

const defaultFamilyFoldersTemplate = [
  '/home/{familyName}/vital-records/',
  '/home/{familyName}/passports+identification/',
  '/home/{familyName}/will+deeds/',
  '/home/{familyName}/medical-records/',
  '/home/{familyName}/policies/',
  '/home/{familyName}/financial-records/',
  '/home/{familyName}/employment+educational/',
  '/home/{familyName}/passwords/',
  '/home/{familyName}/bills+receipts/',
  '/home/{familyName}/home-documents/',
];
export class BucketInitHelper {
  constructor(
    private s3Client: AWS.S3,
    private bucketName: string,
    private familyNames: string[]
  ) {
    this.computeFoldersToCreate.bind(this);
  }

  async initBucket() {
    const foldersToCreate = await this.computeFoldersToCreate();
    console.log(foldersToCreate);
    await this.createFolders(foldersToCreate);
  }

  private async computeFoldersToCreate(): Promise<string[]> {
    const foldersToCreate: string[] = [];
    for (const familyName of this.familyNames) {
      const defaultFolders = applyTemplate<string[]>(
        defaultFamilyFoldersTemplate,
        {
          familyName: familyName,
        }
      );
      for (const folderPath of defaultFolders) {
        try {
          await this.s3Client
            .headObject({
              Bucket: this.bucketName,
              Key: folderPath,
            })
            .promise();
        } catch (error) {
          foldersToCreate.push(folderPath);
        }
      }
    }

    return foldersToCreate;
  }

  private async createFolders(foldersToCreate: string[]) {
    for (const folderPath of foldersToCreate) {
      try {
        await this.s3Client
          .putObject({
            Bucket: this.bucketName,
            Key: folderPath,
          })
          .promise();
      } catch (error) {
        console.error(`error while initializing folder: ${folderPath}`, error);
      }
    }
  }
}
