export interface FileStorageRepository {
  existsFolder(storageURI: string, folderPath: string): Promise<boolean>;
  createFolder(storageURI: string, folderPath: string): Promise<void>;
}
