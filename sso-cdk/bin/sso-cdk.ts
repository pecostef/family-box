#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SsoCdkStack } from '../lib/sso-cdk-stack';
import {
  IdentitystoreClient,
  ListGroupsCommand,
} from '@aws-sdk/client-identitystore';
import { getAWSRegion, getSSOIdentityStoreId } from '../lib/env';

const client = new IdentitystoreClient({ region: getAWSRegion() });
const groupDisplayName = 'FamilyBox';
(async () => {
  const familyBoxGroup = await findByGroupDisplayName(groupDisplayName);

  const app = new cdk.App();
  new SsoCdkStack(
    app,
    'SsoCdkStack',
    {
      groupId: familyBoxGroup!.GroupId!,
      groupName: familyBoxGroup!.DisplayName!,
    },
    {}
  );
})();

async function findByGroupDisplayName(groupDisplayName: string) {
  let data = await client.send(
    new ListGroupsCommand({
      IdentityStoreId: getSSOIdentityStoreId(),
    })
  );
  const groups = data.Groups ?? [];
  while (data.NextToken) {
    data = await client.send(
      new ListGroupsCommand({
        IdentityStoreId: getSSOIdentityStoreId(),
        NextToken: data.NextToken,
      })
    );
    groups?.push(...(data.Groups ?? []));
  }

  const familyBoxGroup = groups.find((g) => {
    return g.DisplayName === groupDisplayName;
  });
  return familyBoxGroup;
}
