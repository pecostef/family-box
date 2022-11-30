export function onBucketResourceCreate() {
  console.log('onBucketResourceCreate');
  console.log('env:', process.env);
}

export function onBucketResourceUpdate() {
  console.log('onBucketResourceUpdate');
  console.log('env:', process.env);
}

function getFamilyBoxBucketName(): string {
  return process.env.bucketName ?? '';
}
