import {
  createCookie,
  createCookieSessionStorage,
  redirect,
  Session,
} from '@remix-run/node';
const sessionSecret = process.env.SESSION_SECRET as string;
const cognitoDomain = process.env.COGNITO_DOMAIN as string;
const clientId = process.env.CLIENT_ID as string;
const idpName = process.env.IDP_NAME as string;
if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be set');
}
if (!cognitoDomain) {
  throw new Error('COGNITO_DOMAIN must be set');
}
if (!clientId) {
  throw new Error('CLIENT_ID must be set');
}

const cookieSettings = {
  maxAge: 60 * 60 * 30,
  secure: process.env.NODE_ENV === 'production',
  secrets: [sessionSecret],
  httpOnly: true,
};

const sessionStorageCookieSettings = {
  maxAge: 60 * 60,
  secure: process.env.NODE_ENV === 'production',
  secrets: [sessionSecret],
  httpOnly: true,
};

const cookieAccessToken = createCookie('cognitoAccessToken', cookieSettings);
const cookieIdToken = createCookie('cognitoIdToken', cookieSettings);
const cookieRefreshToken = createCookie('cognitoRefreshToken', cookieSettings);
const sessionStorage = createCookieSessionStorage({
  cookie: sessionStorageCookieSettings,
});

export async function authenticate(request: Request) {
  const url = new URL(request.url);
  const redirectUri = url.origin + url.pathname;
  const code = url.searchParams.get('code');
  const redirectTo = encodeURIComponent(
    url.searchParams.get('redirectTo') || '/'
  );
  const headers = new Headers();
  let user = await getUserFromSessionStorage(request);
  console.log('usersession', user);
  if (code) {
    //If the url has a code, we redirected the user to the cognito and they were authenticated
    const tokenResponse = await getToken(code, redirectUri);

    if (tokenResponse.status === 200) {
      const json = await tokenResponse.json();
      const { access_token, id_token, refresh_token } = json;
      user = await getUser(access_token);
      headers.append(
        'Set-cookie',
        await cookieAccessToken.serialize({
          access_token,
        })
      );
      headers.append(
        'Set-cookie',
        await cookieIdToken.serialize({
          id_token,
        })
      );
      headers.append(
        'Set-cookie',
        await cookieRefreshToken.serialize({
          refresh_token,
        })
      );
    }
  }
  //The url does not have a code, so this is the first time we are hitting the login page
  //First try to get a user from an access token saved as a cookie
  if (!user) {
    user = await hasValidAccessToken(request);
    if (!user) {
      //Then try to refresh the access token from a refresh token saved as a cookie
      const { accessToken, idToken, refreshToken } = await refreshAccessToken(
        request,
        redirectUri
      );

      if (accessToken) {
        user = await getUser(accessToken);
        if (user) {
          headers.append(
            'Set-cookie',
            await cookieAccessToken.serialize({
              access_token: accessToken,
            })
          );
          headers.append(
            'Set-cookie',
            await cookieIdToken.serialize({
              id_token: idToken,
            })
          );
          headers.append(
            'Set-cookie',
            await cookieRefreshToken.serialize({
              refresh_token: refreshToken,
            })
          );
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
    // persist the user in the session
    const session = await createUserSession(user);
    headers.append('Set-cookie', await sessionStorage.commitSession(session));
    const state = url.searchParams.get('state');
    const finalRedirectTo = decodeURIComponent(state || redirectTo);
    console.log('finalRedirectTo :>> ', finalRedirectTo);
    return redirect(finalRedirectTo, { headers });
  }
  //All failed, return to login
  return redirect(`/login?redirect=${redirectTo}`);
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

export async function getUserFromSessionStorage(
  request: Request
): Promise<any | null> {
  const cookieHeaders = request.headers.get('Cookie');
  if (cookieHeaders) {
    const session = await sessionStorage.getSession(
      request.headers.get('Cookie')
    );
    return session.get('user');
  }
  return null;
}

export async function createUserSession(user: any): Promise<Session> {
  const session = await sessionStorage.getSession();
  session.set('user', user);
  return session;
}

//Get the user info. If this call succeeds, the user is authenticated
export async function getUser(access_token: string) {
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
async function hasValidAccessToken(request: any) {
  const cookieHeaders = request.headers.get('Cookie');
  if (cookieHeaders) {
    const cookieAccessTokenValue = await (cookieAccessToken.parse(
      cookieHeaders
    ) || {});
    if (cookieAccessTokenValue.access_token) {
      return await getUser(cookieAccessTokenValue.access_token);
    }
  }
  return null;
}

async function refreshAccessToken(request: any, redirectUri: string) {
  const ret = {
    accessToken: undefined,
    idToken: undefined,
    refreshToken: undefined,
  };
  const cookieHeaders = request.headers.get('Cookie');
  if (cookieHeaders) {
    const cookieRefreshTokenValue = await (cookieRefreshToken.parse(
      cookieHeaders
    ) || {});
    if (cookieRefreshTokenValue.refresh_token) {
      const uri = `https://${cognitoDomain}/oauth2/token`;
      const body = {
        grant_type: 'refresh_token',
        client_id: clientId,
        redirect_uri: redirectUri,
        refresh_token: cookieRefreshTokenValue.refresh_token,
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
  }
  return ret;
}
