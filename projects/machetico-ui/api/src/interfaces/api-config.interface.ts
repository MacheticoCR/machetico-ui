/**
 * Application-owned transport configuration. Never embed secrets in a browser bundle.
 */
export interface ApiConfig {
  /**
   * Same-origin gateway prefix, or an absolute SSR API URL supplied per request.
   * @property baseUrl
   */
  readonly baseUrl?: string;
  /**
   * Browser credential policy; defaults to same-origin.
   * @property credentials
   */
  readonly credentials?: RequestCredentials;
  /**
   * Fresh public request headers, such as the application's chosen language.
   * @property headers
   */
  readonly headers?: () => Readonly<Record<string, string>>;
}
