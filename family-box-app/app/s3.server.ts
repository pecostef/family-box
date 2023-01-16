import {
  GetObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

const bucket = process.env.S3_BUCKET;
const region = process.env.BUCKET_REGION;

const listItems = async (credentials: any) => {
  const client = new S3Client({
    region,
    credentials,
  });
  const { Contents } = await client.send(
    new ListObjectsCommand({
      Bucket: bucket,
    })
  );

  if (!Contents) {
    return [];
  }

  const fileNames = Contents?.map(({ Key }) => {
    return Key;
  });
  return fileNames;
};

export { listItems };
