/**
 * Consumer-formatted metric projection without report, currency or authorization policy.
 */
export interface DisplayMetric {
  /**
   * Stable presentation identity.
   * @property id
   */
  readonly id: string;
  /**
   * Accessible metric name.
   * @property label
   */
  readonly label: string;
  /**
   * Already formatted display value; null renders the empty-value label.
   * @property value
   */
  readonly value: string | number | null;
  /**
   * Optional context supplied by the consumer.
   * @property detail
   */
  readonly detail?: string;
}
