import { User } from './entities';

export interface StorageRepository {
  createFolder(user: User, path: string): Promise<boolean>;
  existsFolder(user: User, path: string): Promise<boolean>;
  listFolder(user: User, path: string): Promise<any>;
}
