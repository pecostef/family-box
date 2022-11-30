import * as dotenv from 'dotenv';

const SSO_INSTANCE_ARN_VAR_NAME = 'SSO_INSTANCE_ARN';
const DEV_ACCOUNT_ID_VAR_NAME = 'DEV_ACCOUNT_ID';
const SSO_FAMILY_BOX_GROUP_ID_VAR_NAME = 'SSO_FAMILY_BOX_GROUP_ID';
const AWS_REGION_VAR_NAME = 'AWS_REGION';
const SSO_IDENTITY_STORE_ID_VAR_NAME = 'SSO_IDENTITY_STORE_ID';

dotenv.config();

export function getSSOInstanceArn(): string {
  return process.env[SSO_INSTANCE_ARN_VAR_NAME]!;
}

export function getSSOIdentityStoreId(): string {
  return process.env[SSO_IDENTITY_STORE_ID_VAR_NAME]!;
}

export function getDevAccountId(): string {
  return process.env[DEV_ACCOUNT_ID_VAR_NAME]!;
}

export function getSSOFamilyBoxGroupId() {
  return process.env[SSO_FAMILY_BOX_GROUP_ID_VAR_NAME]!;
}

export function getAWSRegion() {
  return process.env[AWS_REGION_VAR_NAME]!;
}
