import { domainValidationError } from '../../usecases/errors';

export interface UserProps {
  name: string;
  email: string;
  identityId: string;
  storageCredentials: unknown;
}

export class User {
  private _name: string;
  private _email: string;
  private _identityId: string;
  private _storageCredentials: unknown;
  constructor(props: UserProps) {
    this.validateUserData(props);
    this._name = props.name;
    this._email = props.email;
    this._identityId = props.identityId;
    this._storageCredentials = props.storageCredentials;
  }

  private validateUserData = (user: UserProps) => {
    if (
      !user ||
      !user.identityId ||
      !user.storageCredentials ||
      !user.email ||
      !user.name
    ) {
      throw domainValidationError();
    }
  };

  get name() {
    return this._name;
  }

  get email() {
    return this._email;
  }

  get identityId() {
    return this._identityId;
  }

  get storageCredentials() {
    return this._storageCredentials;
  }

  toJson = (): UserProps => {
    return {
      name: this.name,
      email: this.email,
      identityId: this.identityId,
      storageCredentials: this.storageCredentials,
    };
  };
}
