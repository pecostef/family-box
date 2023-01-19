import {
  Function,
  StackContext,
  Bucket,
  use,
} from '@serverless-stack/resources';
import { aws_cognito as cognito, RemovalPolicy } from 'aws-cdk-lib';
import { aws_iam as iam } from 'aws-cdk-lib';
import {
  getSamlProviderMetadataUrl,
  getSamlAppCallbackUrls,
  getCognitoDomainPrefix,
} from '../env';
import { StorageStack } from '../storage/StorageStack';
import { generateCognitoAuthRolePermissionStatements } from './policies';

const SAML_IDP_PROVIDER_IDENTIFIER = 'AWSSSOIDP';
export function AuthStack({ stack, app }: StackContext) {
  const { bucket } = use(StorageStack);
  const userPool = new cognito.UserPool(stack, 'FamilyBoxUserPool', {
    userPoolName: app.logicalPrefixedName('family-box-user-pool'),
    removalPolicy:
      app.stage !== 'prod' ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,
    standardAttributes: {
      fullname: { required: true },
      email: { required: true },
      familyName: { required: true },
    },
    autoVerify: {
      email: true,
    },
  });

  addUserPoolTriggers({ stack, app }, SAML_IDP_PROVIDER_IDENTIFIER, userPool);

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
  const userPoolClient = new cognito.UserPoolClient(
    stack,
    'FamilyBoxUserPoolClient',
    {
      userPool,
      ...getUserPoolClientOptions(),
    }
  );
  createIdentityPool({ stack, app }, userPoolClient, userPool, bucket);
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
      callbackUrls: getSamlAppCallbackUrls(),
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

function addUserPoolTriggers(
  { stack, app }: StackContext,
  idpName: string,
  userPool: cognito.UserPool
) {
  const preTokenGenerationTriggerFunction = new Function(
    stack,
    'preTokenGenerationTriggerFunction',
    {
      functionName: app.logicalPrefixedName(
        'preTokenGenerationTriggerFunction'
      ),
      srcPath: 'services/functions/auth/',
      handler: 'pre-token-generation.handler',
      logRetention: 'three_months',
      environment: {
        idpName: idpName,
      },
    }
  );

  userPool.addTrigger(
    cognito.UserPoolOperation.PRE_TOKEN_GENERATION,
    preTokenGenerationTriggerFunction
  );
}

function createIdentityPool(
  { stack, app }: StackContext,
  userPoolAppClient: cognito.UserPoolClient,
  userPool: cognito.UserPool,
  bucket: Bucket
) {
  // Identity pool
  const identityPool = new cognito.CfnIdentityPool(
    stack,
    app.logicalPrefixedName('identity-pool'),
    {
      identityPoolName: app.logicalPrefixedName('identity-pool'),
      allowUnauthenticatedIdentities: false,
      cognitoIdentityProviders: [
        {
          clientId: userPoolAppClient.userPoolClientId,
          providerName: userPool.userPoolProviderName,
        },
      ],
    }
  );

  // Cognito role (For now, both unauthenticated and authenticated)
  const cognitoAuthRole = new iam.Role(stack, 'cognitoAuthRole', {
    assumedBy: new iam.FederatedPrincipal(
      'cognito-identity.amazonaws.com',
      {
        StringEquals: {
          'cognito-identity.amazonaws.com:aud': identityPool.ref,
        },
      },
      'sts:AssumeRoleWithWebIdentity'
    ),
    path: '/',
  });
  const policyStatements = generateCognitoAuthRolePermissionStatements(
    bucket.bucketName
  );

  policyStatements.forEach((p) => {
    const statement = iam.PolicyStatement.fromJson(p);
    cognitoAuthRole.addToPolicy(statement);
  });

  // // Attach role to Identity Pool (auth + unauth)
  new cognito.CfnIdentityPoolRoleAttachment(
    stack,
    'IdentityPoolRoleAttachment',
    {
      identityPoolId: identityPool.ref,
      roles: { authenticated: cognitoAuthRole.roleArn },
    }
  );
}
