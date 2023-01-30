export function getSessionSecret() {
  return process.env.SESSION_SECRET!;
}

export function getCognitoDomain() {
  return process.env.COGNITO_DOMAIN!;
}

export function getOauthClientId() {
  return process.env.CLIENT_ID!;
}

export function getIdpName() {
  return process.env.IDP_NAME!;
}

export function getIdentityPoolId() {
  return process.env.COGNITO_IDENTITY_POOL_ID!;
}

export function getIdentityPoolIdentityProvider() {
  return process.env.COGNITO_IDENTITY_PROVIDER!;
}

export function getIdentityPoolRegion() {
  return process.env.COGNITO_IDENTITY_POOL_REGION!;
}

export function getBucketName() {
  return process.env.S3_BUCKET!;
}

export function getBucketRegion() {
  return process.env.BUCKET_REGION!;
}

export function isProductionEnvironment() {
  return process.env.NODE_ENV === 'production';
}
