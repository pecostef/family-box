import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { generateBucketUserPermissions } from './policies';
import { aws_sso as sso } from 'aws-cdk-lib';
import { getSSOInstanceArn, getDevAccountId } from './env';

const permissionSets = [
  {
    name: 'SSOFamilyBoxDevPermissionSet',
    policy: generateBucketUserPermissions('familybox-dev', 'pecoraro-dotolo'),
  },
];

interface SsoStackProps {
  groupId: string;
  groupName: string;
}

export class SsoCdkStack extends cdk.Stack {
  private permissionSetsArns: string[] = [];
  constructor(
    scope: Construct,
    id: string,
    private stackProps: SsoStackProps,
    props?: cdk.StackProps
  ) {
    super(scope, id, props);

    this.createResourcesForDev();
  }

  private createResourcesForDev() {
    permissionSets.forEach(({ name, policy }) => {
      const createdPermission = this.createPermissionSet(
        name,
        policy,
        getSSOInstanceArn()
      );
      this.permissionSetsArns.push(createdPermission.attrPermissionSetArn);
    });
    const devAccountId = getDevAccountId();
    this.permissionSetsArns.forEach((arn) => {
      this.createPermissionSetGroupAssignment(
        this.stackProps.groupId,
        this.stackProps.groupName,
        arn,
        devAccountId
      );
    });
  }

  private createPermissionSet(name: string, policy: any, instanceArn: string) {
    return new sso.CfnPermissionSet(this, name, {
      name: name,
      instanceArn: instanceArn,
      inlinePolicy: policy,
    });
  }

  private createPermissionSetGroupAssignment(
    groupId: string,
    groupName: string,
    permissionSetArn: string,
    targetAccountId: string
  ) {
    new sso.CfnAssignment(this, `${groupName}Assignment`, {
      instanceArn: getSSOInstanceArn(),
      principalId: groupId,
      principalType: 'GROUP',
      permissionSetArn: permissionSetArn,
      targetId: targetAccountId,
      targetType: 'AWS_ACCOUNT',
    });
  }
}
