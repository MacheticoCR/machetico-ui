/**
 * A consumer-owned column with an accessor; no backend field convention is required.
 * @typeParam T - Row type owned by the consuming application.
 */
export interface TableColumn<T> {
  /**
   * Stable column key used for rendering and sorting intents.
   * @property key
   */
  readonly key: string;

  /**
   * Accessible column heading supplied by the consumer.
   * @property label
   */
  readonly label: string;

  /**
   * Returns display text without exposing executable markup.
   * @property value
   */
  readonly value: (row: T) => string | number | null;

  /**
   * Enables sorting intent; consumers perform the actual local or remote sort.
   * @property sortable
   */
  readonly sortable?: boolean;
}
