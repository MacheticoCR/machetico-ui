/**
 * Consumer-owned document text. Rendering does not imply publication, approval or legal validity.
 */
export interface DocumentSection {
  /**
   * Stable section identity for rendering.
   * @property id
   */
  readonly id: string;
  /**
   * Visible section heading.
   * @property title
   */
  readonly title: string;
  /**
   * Immutable text paragraphs owned by the consumer.
   * @property paragraphs
   */
  readonly paragraphs: readonly string[];
}
