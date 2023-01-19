function removeSpecialCharactersFromFolder(familyFolder: string) {
  return familyFolder.replace(/([^\w ]|_|-)/g, '');
}
function getSid(baseSid: string, familyFolder: string) {
  return `${baseSid}${familyFolder}`;
}
export function generateCognitoAuthRolePermissionStatements(
  bucketName: string,
  familyFolderName: string
): unknown[] {
  const cleanFolderName = removeSpecialCharactersFromFolder(familyFolderName);
  return [
    {
      Action: ['s3:GetBucketLocation', 's3:ListAllMyBuckets'],
      Resource: 'arn:aws:s3:::*',
      Effect: 'Allow',
      Sid: getSid('AllowUserToSeeBucketListInTheConsole', cleanFolderName),
    },
    {
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
      Action: 's3:ListBucket',
      Resource: `arn:aws:s3:::${bucketName}`,
      Effect: 'Allow',
      Sid: getSid('AllowRootAndHomeListingOfFamilyBoxBucket', cleanFolderName),
    },
    {
      Condition: {
        StringLike: {
          's3:prefix': ['/${cognito-identity.amazonaws.com:sub}/*'],
        },
      },
      Action: 's3:ListBucket',
      Resource: `arn:aws:s3:::${bucketName}`,
      Effect: 'Allow',
      Sid: getSid('AllowListingOfUserFolder', cleanFolderName),
    },
    {
      Action: 's3:*',
      Resource: `arn:aws:s3:::${bucketName}/\${cognito-identity.amazonaws.com:sub}/*`,
      Effect: 'Allow',
      Sid: getSid('AllowAllS3ActionsInUserFolder', cleanFolderName),
    },
    {
      Action: 's3:PutObject',
      Resource: `arn:aws:s3:::${bucketName}/home/*`,
      Effect: 'Allow',
      Sid: getSid('AllowPutObjectsInFamilyFolder', cleanFolderName),
    },
  ];
}
