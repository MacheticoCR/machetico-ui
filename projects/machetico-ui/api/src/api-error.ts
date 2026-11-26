/**
 * Non-success HTTP response. Display text remains owned by the consuming application.
 * @class ApiError
 */
export class ApiError extends Error {
  /**
   * Creates a failure without promoting server content to trusted user-facing text.
   * @function constructor
   * @param status - HTTP status code.
   * @param payload - Untrusted parsed response body, available for application validation.
   */
  public constructor(
    /**
     * HTTP status used by the application to handle authorization and recovery.
     * @property status
     */
    public readonly status: number,
    /**
     * Untrusted response data; never interpreted as HTML.
     * @property payload
     */
    public readonly payload: unknown,
  ) {
    super(`HTTP ${status}`);
    this.name = 'ApiError';
  }
}
