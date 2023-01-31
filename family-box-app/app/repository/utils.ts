import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';
import {
  getIdentityPoolId,
  getIdentityPoolRegion,
  getIdentityPoolIdentityProvider,
} from '../env';

export const getCognitoCredentialsFromIdToken = async (idToken: string) => {
  if (!idToken) {
    return null;
  }
  const creds = fromCognitoIdentityPool({
    client: new CognitoIdentityClient({
      region: getIdentityPoolRegion(),
    }),
    identityPoolId: getIdentityPoolId(),
    logins: {
      [getIdentityPoolIdentityProvider()]: idToken,
    },
  });

  const credentials = await creds();
  return credentials;
};
