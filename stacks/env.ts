/* eslint-disable @typescript-eslint/no-non-null-assertion */
const SAML_METADATA_URL_VAR_NAME = 'SAML_METADATA_URL';
const SAML_APP_CALLBACK_URL_VAR_NAME = 'SAML_APP_CALLBACK_URL';
const COGNITO_DOMAIN_PREFIX_VAR_NAME = 'COGNITO_DOMAIN_PREFIX';
const BUCKET_NAME_PREFIX_VAR_NAME = 'BUCKET_NAME_PREFIX';
const FAMILY_NAMES = 'FAMILY_NAMES';

export function getSamlProviderMetadataUrl(): string {
  return process.env[SAML_METADATA_URL_VAR_NAME]!;
}

export function getSamlAppCallbackUrl(): string {
  return process.env[SAML_APP_CALLBACK_URL_VAR_NAME]!;
}

export function getCognitoDomainPrefix(): string {
  return process.env[COGNITO_DOMAIN_PREFIX_VAR_NAME]!;
}

export function getBucketNamePrefix(): string {
  return process.env[BUCKET_NAME_PREFIX_VAR_NAME]!;
}

export function getFamilyNames(): string {
  return process.env[FAMILY_NAMES]!;
}

export function getFamilyNamesAsArray(): string[] {
  return process.env[FAMILY_NAMES]?.trim()?.split(',') ?? [];
}

export function areAllEnvironmentVariablesDefined() {
  return (
    getSamlProviderMetadataUrl() !== undefined &&
    getSamlAppCallbackUrl() !== undefined &&
    getBucketNamePrefix() !== undefined &&
    getFamilyNames().length > 0 &&
    getCognitoDomainPrefix() !== undefined
  );
}
