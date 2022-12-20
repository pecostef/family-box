import { Cognito, StackContext } from '@serverless-stack/resources';
import { aws_cognito as cognito, RemovalPolicy } from 'aws-cdk-lib';
import {
  getSamlProviderMetadataUrl,
  getSamlAppCallbackUrl,
  getCognitoDomainPrefix,
} from './env';

const SAML_IDP_PROVIDER_IDENTIFIER = 'AWSSSOIDP';
export function AuthStack({ stack, app }: StackContext) {
  const userPool = new cognito.UserPool(stack, 'FamilyBoxUserPool', {
    userPoolName: app.logicalPrefixedName('family-box-user-pool'),
    removalPolicy:
      app.stage !== 'prod' ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,
    standardAttributes: {
      fullname: { required: true },
      email: { required: true },
      familyName: { required: true },
    },
  });

  new cognito.UserPoolIdentityProviderSaml(
    stack,
    'FamilyBoxUserPoolIdentityProviderSaml',
    {
      metadata: getIdPSamlMetadata(),
      userPool: userPool,

      // the properties below are optional
      attributeMapping: getSamlAttributeMapping(),
      identifiers: [SAML_IDP_PROVIDER_IDENTIFIER],
      idpSignout: false,
      name: SAML_IDP_PROVIDER_IDENTIFIER,
    }
  );

  userPool.addDomain('FamilyBoxUserPoolDomain', getUserPoolDomainOptions());
  userPool.addClient('FamilyBoxUserPoolClient', getUserPoolClientOptions());
  return {
    userPool,
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
      callbackUrls: [getSamlAppCallbackUrl(), 'http://localhost:3000/login'],
      flows: {
        implicitCodeGrant: true,
        authorizationCodeGrant: true,
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
