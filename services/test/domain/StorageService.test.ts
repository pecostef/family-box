import { beforeEach, describe, expect, it, SpyInstance, vi } from 'vitest';
import { FileStorageRepository } from '../../domain/FileStorageRepository';
import { StorageService } from '../../domain/StorageService';

class MockFileStorageRepository implements FileStorageRepository {
  existsFolder(storageURI: string, folderPath: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  createFolder(storageURI: string, folderPath: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

describe('StorageService', () => {
  let repository: FileStorageRepository;
  let service: StorageService;

  beforeEach(() => {
    repository = new MockFileStorageRepository();
  });
  describe('initializeStorage', () => {
    let existsFolderSpy: SpyInstance;
    let createFolderSpy: SpyInstance;
    beforeEach(() => {
      const date = new Date(2023, 1, 1);
      vi.setSystemTime(date);
      service = new StorageService(repository, {
        storageURI: 'my-bucket',
      });
    });
    describe('if default folders are not present on the storage', () => {
      beforeEach(() => {
        existsFolderSpy = vi
          .spyOn(repository, 'existsFolder')
          .mockResolvedValue(false);
        createFolderSpy = vi
          .spyOn(repository, 'createFolder')
          .mockResolvedValue();
      });
      it('should call existsFolder on the repository for each of the default folder', async () => {
        await service.initializeStorage();

        expect(existsFolderSpy).toBeCalledTimes(10);

        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/vital-records/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/passports+identification/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/will+deeds/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/medical-records/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/policies/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/financial-records/2023/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/employment+educational/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/passwords/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/bills+receipts/2023/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/home-documents/'
        );
      });

      it('should call createFolder on the repository for each of the default folder', async () => {
        await service.initializeStorage();

        expect(createFolderSpy).toBeCalledTimes(10);

        expect(createFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/vital-records/'
        );
        expect(createFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/passports+identification/'
        );
        expect(createFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/will+deeds/'
        );
        expect(createFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/medical-records/'
        );
        expect(createFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/policies/'
        );
        expect(createFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/financial-records/2023/'
        );
        expect(createFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/employment+educational/'
        );
        expect(createFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/passwords/'
        );
        expect(createFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/bills+receipts/2023/'
        );
        expect(createFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/home-documents/'
        );
      });
    });

    describe('if default folders are present on the storage', () => {
      beforeEach(() => {
        existsFolderSpy = vi
          .spyOn(repository, 'existsFolder')
          .mockResolvedValue(true);
        createFolderSpy = vi
          .spyOn(repository, 'createFolder')
          .mockResolvedValue();
      });
      it('should call existsFolder on the repository for each of the default folders', async () => {
        await service.initializeStorage();

        expect(existsFolderSpy).toBeCalledTimes(10);

        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/vital-records/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/passports+identification/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/will+deeds/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/medical-records/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/policies/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/financial-records/2023/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/employment+educational/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/passwords/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/bills+receipts/2023/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/home-documents/'
        );
      });

      it('should not call createFolder on the repository at all', async () => {
        await service.initializeStorage();

        expect(createFolderSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('createYearlyFolders', () => {
    let existsFolderSpy: SpyInstance;
    let createFolderSpy: SpyInstance;
    beforeEach(() => {
      const date = new Date(2025, 5, 5);
      vi.setSystemTime(date);
      service = new StorageService(repository, {
        storageURI: 'my-bucket',
      });
    });
    describe('if yearly folders are not present on the storage', () => {
      beforeEach(() => {
        existsFolderSpy = vi
          .spyOn(repository, 'existsFolder')
          .mockResolvedValue(false);
        createFolderSpy = vi
          .spyOn(repository, 'createFolder')
          .mockResolvedValue();
      });
      it('should call existsFolder on the repository for each of the default folder', async () => {
        await service.createYearlyFolders();

        expect(existsFolderSpy).toBeCalledTimes(2);

        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/bills+receipts/2025/'
        );

        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/financial-records/2025/'
        );
      });

      it('should call createFolder on the repository for each of the default folder', async () => {
        await service.createYearlyFolders();

        expect(createFolderSpy).toBeCalledTimes(2);
        expect(createFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/bills+receipts/2025/'
        );

        expect(createFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/financial-records/2025/'
        );
      });
    });

    describe('if default folders are present on the storage', () => {
      beforeEach(() => {
        existsFolderSpy = vi
          .spyOn(repository, 'existsFolder')
          .mockResolvedValue(true);
        createFolderSpy = vi
          .spyOn(repository, 'createFolder')
          .mockResolvedValue();
      });
      it('should call existsFolder on the repository for each of the default folders', async () => {
        await service.createYearlyFolders();

        expect(existsFolderSpy).toBeCalledTimes(2);
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/bills+receipts/2025/'
        );

        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/financial-records/2025/'
        );
      });

      it('should not call createFolder on the repository at all', async () => {
        await service.createYearlyFolders();

        expect(createFolderSpy).not.toHaveBeenCalled();
      });
    });
  });
});
