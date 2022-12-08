import { RemixSite, StackContext } from '@serverless-stack/resources';
import * as cdk from 'aws-cdk-lib';

export function AppStack({ stack, app }: StackContext) {
  const site = new RemixSite(stack, 'Site', {
    path: 'family-box-app/',
    cdk: {
      bucket: {
        bucketName: app.logicalPrefixedName('familybox-app'),
        autoDeleteObjects: app.stage !== 'prod' ? true : false,
        removalPolicy:
          app.stage !== 'prod'
            ? cdk.RemovalPolicy.DESTROY
            : cdk.RemovalPolicy.RETAIN,
      },
    },
  });

  // Add the site's URL to stack output
  stack.addOutputs({
    URL: site.url,
  });
}
