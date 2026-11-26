/**
 * Typed field value contract for the Machetico UI user interface.
 *
 * @remarks
 * Consumers reuse this structure instead of duplicating field definitions. Runtime inputs still
 * require validation before private access or persistence.
 */
export type FieldValue = string | number | null;
