import { Cognito, StackContext } from '@serverless-stack/resources';
import { aws_cognito as cognito, CfnParameter } from 'aws-cdk-lib';
import {
  getSamlProviderMetadataUrl,
  getSamlAppCallbackUrl,
  getCognitoDomainPrefix,
} from './env';

const SAML_IDP_PROVIDER_IDENTIFIER = 'AWSSSOIDP';
export function AuthStack({ stack }: StackContext) {
  const auth = new Cognito(stack, 'Auth', {
    cdk: {
      userPoolClient: getUserPoolClientOptions(),
      userPool: {
        standardAttributes: {
          fullname: { required: true, mutable: false },
          email: { required: true, mutable: false },
          familyName: { required: true, mutable: false },
        },
      },
    },
  });

  const userPoolIdentityProviderSaml = new cognito.UserPoolIdentityProviderSaml(
    stack,
    'FamilyBoxUserPoolIdentityProviderSaml',
    {
      metadata: getIdPSamlMetadata(),
      userPool: auth.cdk.userPool,

      // the properties below are optional
      attributeMapping: getSamlAttributeMapping(),
      identifiers: [SAML_IDP_PROVIDER_IDENTIFIER],
      idpSignout: false,
      name: SAML_IDP_PROVIDER_IDENTIFIER,
    }
  );

  auth.cdk.userPool.addDomain(
    'FamilyBoxUserPoolDomain',
    getUserPoolDomainOptions()
  );

  return {
    auth,
  };
}

function getIdPSamlMetadata(): cognito.UserPoolIdentityProviderSamlMetadata {
  return {
    metadataType: cognito.UserPoolIdentityProviderSamlMetadataType.URL,
    metadataContent: getSamlProviderMetadataUrl(),
  };
}

function getSamlAttributeMapping(): cognito.AttributeMapping {
  return {
    fullname: { attributeName: 'name' },
    familyName: { attributeName: 'lastName' },
    email: { attributeName: 'email' },
  };
}

function getUserPoolClientOptions(): cognito.UserPoolClientOptions {
  return {
    supportedIdentityProviders: [
      cognito.UserPoolClientIdentityProvider.custom(
        SAML_IDP_PROVIDER_IDENTIFIER
      ),
    ],
    oAuth: {
      callbackUrls: [getSamlAppCallbackUrl()],
      flows: {
        implicitCodeGrant: true,
      },
      scopes: [
        {
          scopeName: 'email',
        },
        {
          scopeName: 'openid',
        },
        {
          scopeName: 'profile',
        },
      ],
    },
    enableTokenRevocation: true,
    preventUserExistenceErrors: true,
    userPoolClientName: 'family-box',
  };
}

function getUserPoolDomainOptions(): cognito.UserPoolDomainOptions {
  return {
    cognitoDomain: {
      domainPrefix: getCognitoDomainPrefix(),
    },
  };
}
