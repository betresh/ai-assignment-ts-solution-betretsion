import { OAuth2Token } from "./tokens";
export type TokenState = OAuth2Token | Record<string, unknown> | null;

export class HttpClient {
  oauth2Token: TokenState = null;

  refreshOAuth2(): void {
    this.oauth2Token = new OAuth2Token("fresh-token", 10 ** 10);
  }

  request(
    method: string,
    path: string,
    opts?: { api?: boolean; headers?: Record<string, string> }
  ): { method: string; path: string; headers: Record<string, string> } {
    const api = opts?.api ?? false;
    const headers = opts?.headers ?? {};

    if (api) {
      // Normalize plain-object tokens into OAuth2Token instances so
      // expiration and header behavior is consistent.
      if (
        this.oauth2Token &&
        !(this.oauth2Token instanceof OAuth2Token) &&
        typeof this.oauth2Token === "object" &&
        "accessToken" in this.oauth2Token &&
        "expiresAt" in this.oauth2Token
      ) {
        const t = this.oauth2Token as Record<string, any>;
        this.oauth2Token = new OAuth2Token(t.accessToken, t.expiresAt);
      }

      if (!this.oauth2Token || (this.oauth2Token instanceof OAuth2Token && this.oauth2Token.expired)) {
        this.refreshOAuth2();
      }

      if (this.oauth2Token instanceof OAuth2Token) {
        headers["Authorization"] = this.oauth2Token.asHeader();
      }
    }

    return { method, path, headers };
  }
}