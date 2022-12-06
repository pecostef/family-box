import { StorageService } from 'domain/StorageService';
import { getFamilyNames } from 'functions/utils/env';
import { resolve, STORAGE_SERVICE_INJ } from '../../inject';

const storageService = resolve<StorageService>(STORAGE_SERVICE_INJ);
export async function onBucketResourceCreate() {
  await executeInit();
}

export async function onBucketResourceUpdate() {
  await executeInit();
}

async function executeInit() {
  await storageService.initializeStorage(getFamilyNames());
}
