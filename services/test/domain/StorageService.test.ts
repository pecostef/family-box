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
        await service.initializeStorage(['my-family', 'my-parents-family']);

        expect(existsFolderSpy).toBeCalledTimes(20);

        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-family/vital-records/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-family/passports+identification/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-family/will+deeds/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-family/medical-records/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-family/policies/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-family/financial-records/2023/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-family/employment+educational/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-family/passwords/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-family/bills+receipts/2023/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-family/home-documents/'
        );

        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-parents-family/vital-records/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-parents-family/passports+identification/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-parents-family/will+deeds/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-parents-family/medical-records/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-parents-family/policies/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-parents-family/financial-records/2023/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-parents-family/employment+educational/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-parents-family/passwords/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-parents-family/bills+receipts/2023/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-parents-family/home-documents/'
        );
      });

      it('should call createFolder on the repository for each of the default folder', async () => {
        await service.initializeStorage(['my-family', 'my-parents-family']);

        expect(createFolderSpy).toBeCalledTimes(20);

        expect(createFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-family/vital-records/'
        );
        expect(createFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-family/passports+identification/'
        );
        expect(createFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-family/will+deeds/'
        );
        expect(createFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-family/medical-records/'
        );
        expect(createFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-family/policies/'
        );
        expect(createFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-family/financial-records/2023/'
        );
        expect(createFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-family/employment+educational/'
        );
        expect(createFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-family/passwords/'
        );
        expect(createFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-family/bills+receipts/2023/'
        );
        expect(createFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-family/home-documents/'
        );

        expect(createFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-parents-family/vital-records/'
        );
        expect(createFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-parents-family/passports+identification/'
        );
        expect(createFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-parents-family/will+deeds/'
        );
        expect(createFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-parents-family/medical-records/'
        );
        expect(createFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-parents-family/policies/'
        );
        expect(createFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-parents-family/financial-records/2023/'
        );
        expect(createFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-parents-family/employment+educational/'
        );
        expect(createFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-parents-family/passwords/'
        );
        expect(createFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-parents-family/bills+receipts/2023/'
        );
        expect(createFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-parents-family/home-documents/'
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
        await service.initializeStorage(['my-family', 'my-parents-family']);

        expect(existsFolderSpy).toBeCalledTimes(20);

        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-family/vital-records/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-family/passports+identification/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-family/will+deeds/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-family/medical-records/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-family/policies/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-family/financial-records/2023/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-family/employment+educational/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-family/passwords/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-family/bills+receipts/2023/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-family/home-documents/'
        );

        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-parents-family/vital-records/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-parents-family/passports+identification/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-parents-family/will+deeds/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-parents-family/medical-records/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-parents-family/policies/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-parents-family/financial-records/2023/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-parents-family/employment+educational/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-parents-family/passwords/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-parents-family/bills+receipts/2023/'
        );
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-parents-family/home-documents/'
        );
      });

      it('should not call createFolder on the repository at all', async () => {
        await service.initializeStorage(['my-family', 'my-parents-family']);

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
        await service.createYearlyFolders(['my-family', 'my-parents-family']);

        expect(existsFolderSpy).toBeCalledTimes(4);

        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-family/bills+receipts/2025/'
        );

        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-family/financial-records/2025/'
        );

        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-parents-family/financial-records/2025/'
        );

        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-parents-family/bills+receipts/2025/'
        );
      });

      it('should call createFolder on the repository for each of the default folder', async () => {
        await service.createYearlyFolders(['my-family', 'my-parents-family']);

        expect(createFolderSpy).toBeCalledTimes(4);
        expect(createFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-family/bills+receipts/2025/'
        );

        expect(createFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-family/financial-records/2025/'
        );

        expect(createFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-parents-family/financial-records/2025/'
        );

        expect(createFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-parents-family/bills+receipts/2025/'
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
        await service.createYearlyFolders(['my-family', 'my-parents-family']);

        expect(existsFolderSpy).toBeCalledTimes(4);
        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-family/bills+receipts/2025/'
        );

        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-family/financial-records/2025/'
        );

        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-parents-family/financial-records/2025/'
        );

        expect(existsFolderSpy).toHaveBeenCalledWith(
          'my-bucket',
          '/home/my-parents-family/bills+receipts/2025/'
        );
      });

      it('should not call createFolder on the repository at all', async () => {
        await service.createYearlyFolders(['my-family', 'my-parents-family']);

        expect(createFolderSpy).not.toHaveBeenCalled();
      });
    });
  });
});
