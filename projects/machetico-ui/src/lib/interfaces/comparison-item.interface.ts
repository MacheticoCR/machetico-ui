/**
 * Generic comparison row without product pricing or purchasing rules.
 */
export interface ComparisonItem {
  /**
   * Stable row identity.
   * @property id
   */
  readonly id: string;
  /**
   * Subject compared by this row.
   * @property title
   */
  readonly title: string;
  /**
   * Consumer-owned baseline description.
   * @property before
   */
  readonly before: string;
  /**
   * Consumer-owned alternative description.
   * @property after
   */
  readonly after: string;
}
