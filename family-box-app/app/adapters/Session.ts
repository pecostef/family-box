export interface Session {
  getIdToken(): Promise<string | null>;
  getAccessToken(): Promise<string | null>;
  getRefreshToken(): Promise<string | null>;
  getCode(): string | null;
  getState(): string | null;
  getRedirectTo(): string;
  getRedirectUri(): string;
}
