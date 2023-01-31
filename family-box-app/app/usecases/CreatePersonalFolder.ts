import { StorageRepository, User } from '../domain';
import { serverError, unauthenticatedError } from './errors';
export class CreatePersonalFolder {
  constructor(private storageRepository: StorageRepository) {}

  private getPersonalFolderPath = (user: User): string => {
    return `${user.identityId}/`;
  };

  execute = async (user: User): Promise<void | Error> => {
    try {
      if (!user) {
        return unauthenticatedError();
      }

      const personalFolderPath = this.getPersonalFolderPath(user);

      if (await this.storageRepository.existsFolder(user, personalFolderPath)) {
        return;
      }

      if (
        !(await this.storageRepository.createFolder(user, personalFolderPath))
      ) {
        return serverError();
      }
    } catch (error) {
      console.log(error);
      return serverError();
    }
  };
}
