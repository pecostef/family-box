import { StorageRepository } from './domain';
import { getBucketName } from './env';
import { S3ClientFactory } from './repository/S3ClientFactory';
import { S3Repository } from './repository/S3Repository';
import { CreatePersonalFolder } from './usecases';

const s3ClientFactory = new S3ClientFactory();
const storageRepository: StorageRepository = new S3Repository(
  getBucketName(),
  s3ClientFactory
);

export const CreatePersonalFolderUseCase = new CreatePersonalFolder(
  storageRepository
);
