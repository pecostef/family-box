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
            '',
            'home/',
            'home/${cognito-identity.amazonaws.com:sub}',
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
        StringEquals: {
          's3:prefix': ['', 'home/', `home/${familyFolderName}`],
          's3:delimiter': ['/'],
        },
      },
      Action: 's3:ListBucket',
      Resource: `arn:aws:s3:::${bucketName}`,
      Effect: 'Allow',
      Sid: getSid('AllowFamilyFolderListingOfFamilyBoxBucket', cleanFolderName),
    },
    {
      Condition: {
        StringLike: {
          's3:prefix': ['home/${cognito-identity.amazonaws.com:sub}/*'],
        },
      },
      Action: 's3:ListBucket',
      Resource: `arn:aws:s3:::${bucketName}`,
      Effect: 'Allow',
      Sid: getSid('AllowListingOfUserFolder', cleanFolderName),
    },
    {
      Condition: {
        StringLike: {
          's3:prefix': [`home/${familyFolderName}/*`],
        },
      },
      Action: 's3:ListBucket',
      Resource: `arn:aws:s3:::${bucketName}`,
      Effect: 'Allow',
      Sid: getSid('AllowListingOfFamilyFolder', cleanFolderName),
    },
    {
      Action: 's3:*',
      Resource: `arn:aws:s3:::${bucketName}/home/\${cognito-identity.amazonaws.com:sub}/*`,
      Effect: 'Allow',
      Sid: getSid('AllowAllS3ActionsInUserFolder', cleanFolderName),
    },
    {
      Action: 's3:*',
      Resource: `arn:aws:s3:::${bucketName}/home/${familyFolderName}/*`,
      Effect: 'Allow',
      Sid: getSid('AllowAllS3ActionsInFamilyFolder', cleanFolderName),
    },
  ];
}
