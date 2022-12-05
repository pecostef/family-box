import { DefaultFoldersUtils } from '../../common/utils/DefaultFoldersUtils';
import { FileStorageRepository } from './FileStorageRepository';
import { StorageConfig } from './StorageConfig';

export class StorageService {
  constructor(
    private repository: FileStorageRepository,
    private storageConfig: StorageConfig
  ) {
    this.computeFoldersToCreate.bind(this);
    this.computeFoldersForFamily.bind(this);
    this.createFolders.bind(this);
  }

  async initializeStorage(familyNames: string[]) {
    const foldersToCreate = await this.computeFoldersToCreate(familyNames);
    await this.createFolders(foldersToCreate);
  }

  async createYearlyFolders(familyNames: string[]) {
    const foldersToCreate = [];
    const year = new Date().getFullYear();
    for (const familyName of familyNames) {
      foldersToCreate.push(
        DefaultFoldersUtils.getYearlyBillingAndReceiptsFolderPrefix(
          familyName,
          year
        ),
        DefaultFoldersUtils.getYearlyFinancialRecordsFolderPrefix(
          familyName,
          year
        )
      );
    }
    for (const folder of foldersToCreate) {
      try {
        if (
          !(await this.repository.existsFolder(
            this.storageConfig.storageURI,
            folder
          ))
        ) {
          await this.repository.createFolder(
            this.storageConfig.storageURI,
            folder
          );
        }
      } catch (e) {
        console.error(
          `unexpected error while creating yearly folder "${folder}"`,
          e
        );
      }
    }
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
        if (
          !(await this.repository.existsFolder(
            this.storageConfig.storageURI,
            folderPath
          ))
        ) {
          foldersToCreate.push(folderPath);
        }
      } catch (e) {
        console.error(
          'unexpected error while veryfing default folder existence',
          e
        );
      }
    }
    return foldersToCreate;
  }

  private async computeFoldersToCreate(
    familyNames: string[]
  ): Promise<string[]> {
    const foldersToCreate: string[] = [];

    for (let familyName of familyNames) {
      const folders = await this.computeFoldersForFamily(familyName);
      foldersToCreate.push(...folders);
    }

    return foldersToCreate;
  }

  private async createFolders(foldersToCreate: string[]) {
    for (const folderPath of foldersToCreate) {
      try {
        await this.repository.createFolder(
          this.storageConfig.storageURI,
          folderPath
        );
      } catch (error) {
        console.error(`error while initializing folder: ${folderPath}`, error);
      }
    }
  }
}
