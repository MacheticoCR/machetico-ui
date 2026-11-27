/**
 * Accessible step-selection item without validation, payment or completion policy.
 */
export interface PresentationStep {
  /**
   * Stable step selection value.
   * @property id
   */
  readonly id: string;
  /**
   * Visible and accessible step label.
   * @property label
   */
  readonly label: string;
  /**
   * Optional step explanation.
   * @property description
   */
  readonly description?: string;
  /**
   * Whether selection is unavailable according to the consumer.
   * @property disabled
   */
  readonly disabled?: boolean;
}
