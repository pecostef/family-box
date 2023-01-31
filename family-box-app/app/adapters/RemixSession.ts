import {
  cookieAccessToken,
  cookieIdToken,
  cookieRefreshToken,
} from './cookie-storage';
import { Session } from './Session';

export class RemixSession implements Session {
  constructor(private request: Request) {}

  getState(): string | null {
    const url = this.getUrl();
    return url.searchParams.get('state');
  }

  getCode(): string | null {
    const url = this.getUrl();
    return url.searchParams.get('code');
  }

  getRedirectUri(): string {
    const url = this.getUrl();
    return url.origin + url.pathname;
  }

  getRedirectTo(): string {
    const url = this.getUrl();
    return encodeURIComponent(url.searchParams.get('redirectTo') || '/');
  }

  async getIdToken(): Promise<string | null> {
    const cookieHeaders = this.request.headers.get('Cookie');
    if (cookieHeaders) {
      const cookieIdTokenValue = await (cookieIdToken.parse(cookieHeaders) ||
        {});
      return cookieIdTokenValue.idToken;
    }
    return null;
  }

  async getAccessToken(): Promise<string | null> {
    const cookieHeaders = this.request.headers.get('Cookie');
    if (cookieHeaders) {
      const cookieAccessTokenValue = await (cookieAccessToken.parse(
        cookieHeaders
      ) || {});
      if (cookieAccessTokenValue?.accessToken) {
        return await cookieAccessTokenValue.accessToken;
      }
    }
    return null;
  }

  async getRefreshToken(): Promise<string | null> {
    const cookieHeaders = this.request.headers.get('Cookie');
    if (cookieHeaders) {
      const cookieRefreshTokenValue = await (cookieRefreshToken.parse(
        cookieHeaders
      ) || {});
      if (cookieRefreshTokenValue?.refreshToken) {
        return cookieRefreshTokenValue.refreshToken;
      }
    }
    return null;
  }

  private getUrl(): URL {
    return new URL(this.request.url);
  }
}
