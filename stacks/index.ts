import { App } from '@serverless-stack/resources';
import { RemovalPolicy } from 'aws-cdk-lib';
import { areAllEnvironmentVariablesDefined } from './env';
import { S3Stack } from './storage/StorageStack';

export default function (app: App) {
  if (!areAllEnvironmentVariablesDefined()) {
    console.error('not all needed environment variables are defined');
    process.exit(-1);
  }

  // Remove all resources when non-prod stages are removed
  if (app.stage !== 'prod') {
    app.setDefaultRemovalPolicy(RemovalPolicy.DESTROY);
  }
  app.setDefaultFunctionProps({
    runtime: 'nodejs16.x',
    srcPath: 'services',
    bundle: {
      format: 'esm',
    },
  });

  app.stack(S3Stack);
}
