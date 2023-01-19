/* eslint-disable @typescript-eslint/no-non-null-assertion */
const SAML_METADATA_URL_VAR_NAME = 'SAML_METADATA_URL';
const SAML_APP_CALLBACK_URLS_VAR_NAME = 'SAML_APP_CALLBACK_URLS';
const COGNITO_DOMAIN_PREFIX_VAR_NAME = 'COGNITO_DOMAIN_PREFIX';
const BUCKET_NAME_PREFIX_VAR_NAME = 'BUCKET_NAME_PREFIX';

export function getSamlProviderMetadataUrl(): string {
  return process.env[SAML_METADATA_URL_VAR_NAME]!;
}

export function getCognitoDomainPrefix(): string {
  return process.env[COGNITO_DOMAIN_PREFIX_VAR_NAME]!;
}

export function getBucketNamePrefix(): string {
  return process.env[BUCKET_NAME_PREFIX_VAR_NAME]!;
}

export function getSamlAppCallbackUrls(): string[] {
  return process.env[SAML_APP_CALLBACK_URLS_VAR_NAME]?.trim()?.split(',') ?? [];
}

export function areAllEnvironmentVariablesDefined() {
  return (
    getSamlProviderMetadataUrl() !== undefined &&
    getSamlAppCallbackUrls() !== undefined &&
    getBucketNamePrefix() !== undefined &&
    getCognitoDomainPrefix() !== undefined
  );
}
