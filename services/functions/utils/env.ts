export function getFamilyBoxBucketName(): string {
  return process.env.bucketName ?? '';
}

// familyNames env variable example: "family1, family"
export function getFamilyNames(): string[] {
  return process.env.familyNames?.trim()?.split(',') ?? [];
}
