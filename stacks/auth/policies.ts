export function generateCognitoAuthRolePermissionStatements(
  bucketName: string
): unknown[] {
  return [
    {
      Sid: 'AllowRootAndHomeListingOfFamilyBoxBucket',
      Action: 's3:ListBucket',
      Resource: `arn:aws:s3:::${bucketName}`,
      Effect: 'Allow',
      Condition: {
        StringEquals: {
          's3:prefix': [
            '/',
            '/home/',
            '/${cognito-identity.amazonaws.com:sub}/',
          ],
          's3:delimiter': ['/'],
        },
      },
    },
    {
      Sid: 'AllowListingOfUserFolder',
      Action: 's3:ListBucket',
      Resource: `arn:aws:s3:::${bucketName}`,
      Effect: 'Allow',
      Condition: {
        StringLike: {
          's3:prefix': ['/${cognito-identity.amazonaws.com:sub}/*'],
        },
      },
    },
    {
      Sid: 'AllowAllS3ActionsInUserFolder',
      Action: 's3:*',
      Resource: `arn:aws:s3:::${bucketName}/\${cognito-identity.amazonaws.com:sub}/*`,
      Effect: 'Allow',
    },
    {
      Sid: 'AllowPutObjectsInFamilyFolder',
      Action: 's3:PutObject',
      Resource: `arn:aws:s3:::${bucketName}/home/*`,
      Effect: 'Allow',
    },
  ];
}
