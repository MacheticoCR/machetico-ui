/**
 * Consumer-owned motion identity for a scoped viewport entrance; no visual keyframes are built in.
 */
export interface ScrollRevealOptions {
  /**
   * Visual frames supplied by the application; absent frames use only semantic reveal state.
   * @property keyframes
   */
  readonly keyframes?: readonly Keyframe[];
  /**
   * Animation duration in milliseconds; defaults to 320.
   * @property duration
   */
  readonly duration?: number;
  /**
   * Per-column delay in milliseconds; defaults to 45 across three stagger positions.
   * @property stagger
   */
  readonly stagger?: number;
  /**
   * Application easing; defaults to Taurus's cubic-bezier(.2,.7,.2,1).
   * @property easing
   */
  readonly easing?: string;
}
