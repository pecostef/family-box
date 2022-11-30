export function generateBucketUserPermissions(
  bucketName: string,
  familyFolderName: string
) {
  return {
    Version: '2012-10-17',
    Statement: [
      {
        Action: ['s3:GetBucketLocation', 's3:ListAllMyBuckets'],
        Resource: 'arn:aws:s3:::*',
        Effect: 'Allow',
        Sid: 'AllowUserToSeeBucketListInTheConsole',
      },
      {
        Condition: {
          StringEquals: {
            's3:prefix': ['', 'home/', 'home/${aws:userid}'],
            's3:delimiter': ['/'],
          },
        },
        Action: 's3:ListBucket',
        Resource: `arn:aws:s3:::${bucketName}`,
        Effect: 'Allow',
        Sid: 'AllowRootAndHomeListingOfFamilyBoxBucket',
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
        Sid: 'AllowFamilyFolderListingOfFamilyBoxBucket',
      },
      {
        Condition: {
          StringLike: {
            's3:prefix': ['home/${aws:userid}/*'],
          },
        },
        Action: 's3:ListBucket',
        Resource: `arn:aws:s3:::${bucketName}`,
        Effect: 'Allow',
        Sid: 'AllowListingOfUserFolder',
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
        Sid: 'AllowListingOfFamilyFolder',
      },
      {
        Action: 's3:*',
        Resource: `arn:aws:s3:::${bucketName}/home/\${aws:userid}/*`,
        Effect: 'Allow',
        Sid: 'AllowAllS3ActionsInUserFolder',
      },
      {
        Action: 's3:*',
        Resource: `arn:aws:s3:::${bucketName}/home/${familyFolderName}/*`,
        Effect: 'Allow',
        Sid: 'AllowAllS3ActionsInFamilyFolder',
      },
    ],
  };
}
