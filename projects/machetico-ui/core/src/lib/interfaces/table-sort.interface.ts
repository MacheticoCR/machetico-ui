/**
 * Immutable sorting intent; the application owns row order and remote reads.
 */
export interface TableSort {
  /**
   * Column identifier supplied by the consumer.
   * @property key
   */
  readonly key: string;

  /**
   * Requested sort direction.
   * @property direction
   */
  readonly direction: 'asc' | 'desc';
}
