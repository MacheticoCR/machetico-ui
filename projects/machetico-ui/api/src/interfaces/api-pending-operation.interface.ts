/**
 * Internal completion ownership for one immutable Angular command resource.
 */
export interface ApiPendingOperation {
  /**
   * Settles the operation when its Angular resource has completed.
   * @property complete
   */
  readonly complete: () => void;
  /**
   * Cancels the resource on caller abort or environment destruction.
   * @property cancel
   */
  readonly cancel: () => void;
}
