/**
 * Native image source and responsive candidates supplied to the browser.
 *
 * @remarks
 * Consumers reuse this structure instead of duplicating field definitions. Runtime inputs still
 * require validation before private access or persistence.
 */
export interface ResponsiveImage {
  /**
   * Browser-loadable image URL supplied by the consumer.
   *
   * @property src
   */
  readonly src: string;

  /**
   * Optional responsive candidate URLs and width descriptors.
   *
   * @property srcset
   */
  readonly srcset: string | null;
}
