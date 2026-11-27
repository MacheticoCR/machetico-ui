import { computed, Directive, input } from '@angular/core';
import type { ResponsiveImage } from 'machetico-ui/core';

/**
 * Builds responsive source candidates from a consumer-owned image URL.
 *
 * @function responsiveImage
 * @param source - Consumer-owned image URL; unsigned versioned Cloudinary URLs support width transforms.
 * @param widths - Candidate widths in CSS pixels.
 * @returns The `ResponsiveImage` value produced by this operation.
 *
 * @example
 * ```ts
 * declare const args: Parameters<typeof responsiveImage>;
 * responsiveImage(...args);
 * ```
 */
export function responsiveImage(source: string, widths: readonly number[]): ResponsiveImage {
  const original = { src: source, srcset: null };
  if (!/^https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\//.test(source)) return original;
  const url = new URL(source);
  if (/\/s--[^/]+--\//.test(url.pathname) || url.searchParams.has('__cld_token__')) return original;
  const sizes = [
    ...new Set(widths.filter((width) => Number.isInteger(width) && width > 0 && width <= 2560)),
  ]
    .sort((a, b) => a - b)
    .slice(0, 8);
  if (!sizes.length || !/\/v\d+\//.test(url.pathname)) return original;

  /**
   * Builds a width-qualified image URL while preserving the original source URL.
   *
   * @function atWidth
   * @param width - Requested image width in CSS pixels.
   * @returns The `string` value produced by this operation.
   */
  const atWidth = (width: number): string => {
    const result = new URL(url);
    result.pathname = result.pathname.replace(
      /\/v(\d+)\//,
      `/f_auto,q_auto,c_limit,w_${width}/v$1/`,
    );
    return result.href;
  };
  return {
    src: atWidth(sizes.find((width) => width >= 960) ?? sizes[sizes.length - 1]),
    srcset: sizes.map((width) => `${atWidth(width)} ${width}w`).join(', '),
  };
}
/**
 * Native responsive-image bindings without network access or upload ownership.
 *
 * @class ResponsiveImageDirective
 */
@Directive({
  selector: 'img[macheticoImage]',
  host: {
    '[src]': 'image().src',
    '[attr.srcset]': 'image().srcset',
    '[attr.sizes]': 'sizes()',
  },
})
export class ResponsiveImageDirective {
  /**
   * Consumer-owned image URL; unsigned versioned Cloudinary URLs support width transforms.
   *
   * @property source
   */
  public readonly source = input.required<string>({ alias: 'macheticoImage' });

  /**
   * Candidate image widths in CSS pixels for the responsive source set.
   *
   * @property widths
   */
  public readonly widths = input<readonly number[]>([320, 640, 960], { alias: 'imageWidths' });

  /**
   * Native sizes attribute describing the image slot in the consuming layout.
   *
   * @property sizes
   */
  public readonly sizes = input('100vw', { alias: 'imageSizes' });

  /**
   * Derived image source and responsive candidates; signed provider URLs remain unchanged.
   *
   * @property image
   */
  public readonly image = computed(() => responsiveImage(this.source(), this.widths()));
}
