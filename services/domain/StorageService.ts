import { DefaultFoldersUtils } from '../../common/utils/DefaultFoldersUtils';
import { FileStorageRepository } from './FileStorageRepository';
import { StorageConfig } from './StorageConfig';

export class StorageService {
  constructor(
    private repository: FileStorageRepository,
    private storageConfig: StorageConfig
  ) {
    this.computeFoldersToCreate.bind(this);
    this.createFolders.bind(this);
  }

  async initializeStorage() {
    const foldersToCreate = await this.computeFoldersToCreate();
    await this.createFolders(foldersToCreate);
  }

  async createYearlyFolders() {
    const foldersToCreate = [];
    const year = new Date().getFullYear();
    foldersToCreate.push(
      DefaultFoldersUtils.getYearlyBillingAndReceiptsFolderPrefix(year),
      DefaultFoldersUtils.getYearlyFinancialRecordsFolderPrefix(year)
    );
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

  private async computeFoldersToCreate(): Promise<string[]> {
    const foldersToCreate: string[] = [];

    const currentYear = new Date().getFullYear();
    const defaultFolders = DefaultFoldersUtils.getDefaultFolders(currentYear);

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
