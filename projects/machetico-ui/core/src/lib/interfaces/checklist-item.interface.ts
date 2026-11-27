/**
 * Read-only presentation step; it does not confirm any business workflow or institutional result.
 */
export interface ChecklistItem {
  /**
   * Stable step identity.
   * @property id
   */
  readonly id: string;
  /**
   * Visible step heading.
   * @property title
   */
  readonly title: string;
  /**
   * Consumer-owned explanatory lines.
   * @property details
   */
  readonly details: readonly string[];
  /**
   * Display-only completion indication supplied by the owning application.
   * @property completed
   */
  readonly completed?: boolean;
  /**
   * Whether this is the currently displayed step.
   * @property current
   */
  readonly current?: boolean;
}
