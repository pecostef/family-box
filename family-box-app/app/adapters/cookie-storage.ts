import { createCookie, createCookieSessionStorage } from '@remix-run/node';
import {
  getCognitoDomain,
  getOauthClientId,
  getSessionSecret,
  isProductionEnvironment,
} from '~/env';

const sessionSecret = getSessionSecret();
const cognitoDomain = getCognitoDomain();
const clientId = getOauthClientId();

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
  secure: isProductionEnvironment(),
  secrets: [sessionSecret],
  httpOnly: true,
};

const sessionStorageCookieSettings = {
  maxAge: 60 * 60,
  secure: isProductionEnvironment(),
  secrets: [sessionSecret],
  httpOnly: true,
};

export const cookieAccessToken = createCookie(
  'cognitoAccessToken',
  cookieSettings
);
export const cookieIdToken = createCookie('cognitoIdToken', cookieSettings);
export const cookieRefreshToken = createCookie(
  'cognitoRefreshToken',
  cookieSettings
);
export const sessionStorage = createCookieSessionStorage({
  cookie: sessionStorageCookieSettings,
});
