/**
 * Caller-owned cancellation for one explicit command.
 */
export interface ApiCommandOptions {
  /**
   * Cancels the request in addition to application destruction.
   * @property signal
   */
  readonly signal?: AbortSignal;
}
