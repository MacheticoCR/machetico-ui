/**
 * Consumer-owned accessible image metadata for the gallery.
 *
 * @remarks
 * Consumers reuse this structure instead of duplicating field definitions. Runtime inputs still
 * require validation before private access or persistence.
 */
export interface ImageSlide {
  /**
   * String representation of the entity identifier; it does not create a second identity.
   *
   * @property id
   */
  readonly id: string;

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
   * @remarks
   * Optional: absence is not automatically equivalent to zero, false, or an empty string.
   */
  readonly srcset?: string;

  /**
   * Accessible description of the image supplied by the consumer.
   *
   * @property alt
   */
  readonly alt: string;

  /**
   * Visible image caption supplied by the consumer.
   *
   * @property caption
   */
  readonly caption: string;
}
