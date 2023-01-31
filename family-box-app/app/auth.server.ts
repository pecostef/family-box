import { redirect } from '@remix-run/node';
import {
  cookieAccessToken,
  cookieIdToken,
  cookieRefreshToken,
} from './adapters/cookie-storage';
import { Session } from './adapters/Session';
import { User, UserProps } from './domain';
import { getCognitoDomain, getIdpName, getOauthClientId } from './env';
import { getCognitoCredentialsFromIdToken } from './repository/utils';

const cognitoDomain = getCognitoDomain();
const clientId = getOauthClientId();
const idpName = getIdpName();

export async function authenticate(session: Session) {
  const redirectUri = session.getRedirectUri();
  const code = session.getCode();
  const redirectTo = session.getRedirectTo();
  const headers = new Headers();
  let user: unknown;
  if (code) {
    //If the url has a code, we redirected the user to the cognito and they were authenticated
    const tokenResponse = await getToken(code, redirectUri);

    if (tokenResponse.status === 200) {
      const json = await tokenResponse.json();
      const { access_token, id_token, refresh_token } = json;
      user = await getUser(access_token);
      await setAccessToken(access_token, headers);
      await setIdToken(id_token, headers);
      await setRefreshToken(refresh_token, headers);
      //idPoolIdToken = id_token;
    }
  }
  //The url does not have a code, so this is the first time we are hitting the login page
  //First try to get a user from an access token saved as a cookie
  if (!user) {
    user = await hasValidAccessToken(session);
    if (!user) {
      //Then try to refresh the access token from a refresh token saved as a cookie
      const { accessToken, idToken, refreshToken } = await refreshAccessToken(
        session
      );

      if (accessToken) {
        user = await getUser(accessToken);
        if (user) {
          await setAccessToken(accessToken, headers);
          await setIdToken(idToken!, headers);
          await setRefreshToken(refreshToken!, headers);
        }
      }
    }
    if (!user) {
      const idpUriSection = idpName
        ? `&identity_provider=${idpName}&idp_identifier=${idpName}`
        : '';
      //if we still have no user then send them to the cognito login page
      const uri = `https://${cognitoDomain}/oauth2/authorize?client_id=${clientId}&response_type=code&scope=email+openid+profile&redirect_uri=${redirectUri}&state=${redirectTo}${idpUriSection}`;
      console.log('redirecturi', uri);
      return redirect(uri);
    }
  }
  if (user) {
    const state = session.getState();
    const finalRedirectTo = decodeURIComponent(state || redirectTo);
    console.log('finalRedirectTo :>> ', finalRedirectTo);
    return redirect(finalRedirectTo, { headers });
  }
  //All failed, return to login
  return redirect(`/login?redirect=${redirectTo}`);
}

export async function getUserFromSession(
  session: Session
): Promise<User | null> {
  const accessToken = await session.getAccessToken();
  const idToken = await session.getIdToken();
  if (accessToken && idToken) {
    const userProps = (await getUser(accessToken)) as UserProps;
    const storageCredentials = await getCognitoCredentialsFromIdToken(idToken);
    userProps.identityId = storageCredentials?.identityId!;
    userProps.storageCredentials = storageCredentials;
    const user = new User(userProps);
    return user;
  }
  return null;
}

//Make the call to cognito to get the token
async function getToken(code: string, redirectUri: string) {
  const uri = `https://${cognitoDomain}/oauth2/token`;
  const body = {
    grant_type: 'authorization_code',
    client_id: clientId,
    redirect_uri: redirectUri,
    code,
  };
  const response = await fetch(uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(body),
  });
  return response;
}

//Get the user info. If this call succeeds, the user is authenticated
async function getUser(access_token: string) {
  const uri = `https://${cognitoDomain}/oauth2/userInfo`;

  const response = await fetch(uri, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  if (response.status === 200) {
    return await response.json();
  } else {
    return null;
  }
}

//Does the user have a valid access token? If so, return the user info
async function hasValidAccessToken(session: Session) {
  const accessToken = await session.getAccessToken();
  if (accessToken) {
    return await getUser(accessToken);
  }
  return null;
}

async function refreshAccessToken(session: Session) {
  const ret = {
    accessToken: undefined,
    idToken: undefined,
    refreshToken: undefined,
  };
  const refreshToken = await session.getRefreshToken();
  if (refreshToken) {
    const uri = `https://${cognitoDomain}/oauth2/token`;
    const body = {
      grant_type: 'refresh_token',
      client_id: clientId,
      redirect_uri: session.getRedirectUri(),
      refresh_token: refreshToken,
    };
    const response = await fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(body),
    });
    if (response.status === 200) {
      const json = await response.json();
      const { access_token, id_token, refresh_token } = json;
      ret.accessToken = access_token;
      ret.idToken = id_token;
      ret.refreshToken = refresh_token;
    }
  }
  return ret;
}

async function setIdToken(idToken: string, headers: Headers): Promise<void> {
  headers.append(
    'Set-cookie',
    await cookieIdToken.serialize({
      idToken,
    })
  );
}

async function setAccessToken(
  accessToken: string,
  headers: Headers
): Promise<void> {
  headers.append(
    'Set-cookie',
    await cookieAccessToken.serialize({
      accessToken,
    })
  );
}

async function setRefreshToken(
  refreshToken: string,
  headers: Headers
): Promise<void> {
  headers.append(
    'Set-cookie',
    await cookieRefreshToken.serialize({
      refreshToken,
    })
  );
}
