/**
 * Typed choice contract for the Machetico UI user interface.
 *
 * @remarks
 * Consumers reuse this structure instead of duplicating field definitions. Runtime inputs still
 * require validation before private access or persistence.
 * @typeParam T - The caller-supplied type retained by this reusable contract.
 */
export interface Choice<T extends string = string> {
  /**
   * Current typed value received from or emitted to the consuming contract.
   *
   * @property value
   */
  readonly value: T;

  /**
   * Visible label, configured or translated according to its source.
   *
   * @property label
   */
  readonly label: string;
}
