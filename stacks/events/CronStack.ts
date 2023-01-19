import {
  Cron,
  StackContext,
  Stack,
  App,
  Function,
  use,
} from '@serverless-stack/resources';
import { StorageStack } from '../storage/StorageStack';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Schedule } from 'aws-cdk-lib/aws-events';

export function CronStack({ stack, app }: StackContext) {
  createYearlyFoldersCron(stack, app);
}

function createYearlyFoldersCron(stack: Stack, app: App) {
  const { bucket } = use(StorageStack);
  const createYearlyFoldersFunction = new Function(
    stack,
    'createYearlyFoldersCron',
    {
      functionName: app.logicalPrefixedName(
        'createYearlyFoldersCronLambdaTarget'
      ),
      srcPath: 'services/functions/events/',
      handler: 'cron.createYearlyFolders',
      logRetention: 'three_months',
      environment: {
        bucketName: bucket.bucketName,
      },
    }
  );
  const cron = new Cron(stack, 'YearlyFolderCreationCron', {
    cdk: {
      rule: {
        // every year 1st January 00:01
        schedule: Schedule.cron({
          minute: '1',
          hour: '0',
          day: '1',
          month: '1',
        }),
      },
    },
    job: {
      function: createYearlyFoldersFunction,
    },
  });
  const policyStatement = new iam.PolicyStatement({
    resources: [bucket.bucketArn, `${bucket.bucketArn}/*`],
    actions: [
      's3:ListBucket',
      's3:PutObject',
      's3:PutObjectAcl',
      's3:GetObject',
      's3:GetObjectAcl',
      's3:AbortMultipartUpload',
    ],
    effect: iam.Effect.ALLOW,
  });

  cron.attachPermissions([policyStatement]);
}
