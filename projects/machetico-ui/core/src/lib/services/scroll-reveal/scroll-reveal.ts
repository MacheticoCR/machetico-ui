import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  AnimationCallbackEvent,
  DestroyRef,
  inject,
  Injectable,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import type { ScrollRevealOptions } from '../../interfaces';
/**
 * Scoped Taurus viewport-reveal coordination; visual keyframes and pending styles belong to the consumer.
 * @class ScrollReveal
 */
@Injectable()
export class ScrollReveal {
  /**
   * Prevents observers, motion queries and animation work during SSR.
   * @property browser
   */
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  /**
   * Document providing focus, print and motion policy without hidden global state.
   * @property document
   */
  private readonly document = inject(DOCUMENT);
  /**
   * Shared observer created lazily within this component-provided service scope.
   * @property observer
   */
  private observer?: IntersectionObserver;
  /**
   * Reveal callbacks retained only for elements still awaiting intersection.
   * @property pending
   */
  private readonly pending = new Map<Element, () => void>();
  /**
   * Cancellation of active observations, focus and motion listeners.
   * @property observations
   */
  private readonly observations = new Map<Element, () => void>();
  /**
   * Cancellation of in-progress animation callbacks.
   * @property animations
   */
  private readonly animations = new Map<Element, () => void>();
  /**
   * Reports whether an entrance has finished in this service scope.
   * @property finished
   */
  public readonly finished = signal(false);
  /**
   * Registers Angular-owned cleanup while preserving explicit component-level provider lifetime.
   * @function constructor
   */
  public constructor() {
    inject(DestroyRef).onDestroy(() => {
      for (const finish of [...this.animations.values()]) finish();
      for (const release of [...this.observations.values()]) release();
      this.observer?.disconnect();
    });
  }
  /**
   * Observes an element once and reveals it on intersection, focus, print or reduced motion.
   * @function observe
   * @param element - Native element with consumer-owned pending and visible styles.
   * @param onReveal - Called once when reveal is permitted; cancellation does not invoke it.
   * @returns Idempotent cancellation that restores visibility and releases retained references.
   */
  public observe(element: Element, onReveal: () => void): () => void {
    this.observations.get(element)?.();
    const view = this.document.defaultView;
    if (!this.browser) {
      onReveal();
      return () => {};
    }
    if (!view || typeof IntersectionObserver === 'undefined') {
      element.setAttribute('data-reveal', 'visible');
      onReveal();
      return () => {};
    }
    const motion = view.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (motion?.matches || element.contains(this.document.activeElement)) {
      element.setAttribute('data-reveal', 'visible');
      onReveal();
      return () => {};
    }
    if (!this.observer)
      this.observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) if (entry.isIntersecting) this.pending.get(entry.target)?.();
        },
        { threshold: 0.08, rootMargin: '0px 0px -24px 0px' },
      );
    let completed = false;
    const finish = (notify: boolean): void => {
      if (completed) return;
      completed = true;
      this.observer?.unobserve(element);
      this.pending.delete(element);
      this.observations.delete(element);
      element.removeEventListener('focusin', show);
      view.removeEventListener('beforeprint', show);
      motion?.removeEventListener('change', motionChanged);
      element.setAttribute('data-reveal', 'visible');
      if (notify) onReveal();
    };
    const show = (): void => finish(true);
    const motionChanged = (): void => {
      if (motion?.matches) show();
    };
    const release = (): void => finish(false);
    this.pending.set(element, show);
    this.observations.set(element, release);
    element.setAttribute('data-reveal', 'pending');
    element.addEventListener('focusin', show);
    view.addEventListener('beforeprint', show);
    motion?.addEventListener('change', motionChanged);
    this.observer.observe(element);
    return release;
  }
  /**
   * Adapts Angular animate.enter to one viewport entrance using application-supplied keyframes.
   * @function enter
   * @param event - Angular animation callback whose completion is always released exactly once.
   * @param column - Zero-based stagger position, normalized across three columns.
   * @param options - Consumer-owned frames and optional timing configuration.
   */
  public enter(event: AnimationCallbackEvent, column = 0, options: ScrollRevealOptions = {}): void {
    const element = event.target;
    this.animations.get(element)?.();
    if (!this.browser) {
      event.animationComplete();
      return;
    }
    if (typeof IntersectionObserver === 'undefined' || typeof element.animate !== 'function') {
      element.setAttribute('data-reveal', 'visible');
      this.finished.set(true);
      event.animationComplete();
      return;
    }
    const view = this.document.defaultView;
    const motion = view?.matchMedia?.('(prefers-reduced-motion: reduce)');
    let animation: Animation | undefined;
    let release = (): void => {};
    let completed = false;
    const finish = (): void => {
      if (completed) return;
      completed = true;
      release();
      animation?.cancel();
      this.animations.delete(element);
      element.removeEventListener('focusin', finish);
      view?.removeEventListener('beforeprint', finish);
      motion?.removeEventListener('change', motionChanged);
      element.setAttribute('data-reveal', 'visible');
      this.finished.set(true);
      event.animationComplete();
    };
    const motionChanged = (): void => {
      if (motion?.matches) finish();
    };
    const play = (): void => {
      if (
        this.document.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches ||
        element.contains(this.document.activeElement) ||
        !options.keyframes?.length ||
        typeof element.animate !== 'function'
      ) {
        finish();
        return;
      }
      try {
        animation = element.animate([...options.keyframes], {
          duration: options.duration ?? 320,
          delay: (((column % 3) + 3) % 3) * (options.stagger ?? 45),
          easing: options.easing ?? 'cubic-bezier(.2,.7,.2,1)',
          fill: 'both',
        });
        animation.finished.then(finish, finish);
      } catch {
        finish();
      }
    };
    element.addEventListener('focusin', finish);
    view?.addEventListener('beforeprint', finish);
    motion?.addEventListener('change', motionChanged);
    this.animations.set(element, finish);
    release = this.observe(element, play);
  }
  /**
   * Completes an explicitly leaving view without retaining its observer or replaying entrance motion.
   * @function leave
   * @param event - Angular leave callback owned by the departing view.
   */
  public leave(event: AnimationCallbackEvent): void {
    this.animations.get(event.target)?.();
    this.observations.get(event.target)?.();
    event.animationComplete();
  }
}
