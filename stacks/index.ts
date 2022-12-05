import { App } from '@serverless-stack/resources';
import { areAllEnvironmentVariablesDefined } from './env';
import { CronStack } from './events/CronStack';
import { StorageStack } from './storage/StorageStack';

export default function (app: App) {
  if (!areAllEnvironmentVariablesDefined()) {
    console.error('not all needed environment variables are defined');
    process.exit(-1);
  }

  app.setDefaultFunctionProps({
    runtime: 'nodejs16.x',
    srcPath: 'services',
    bundle: {
      format: 'esm',
    },
  });

  app.stack(StorageStack);
  app.stack(CronStack);
}
