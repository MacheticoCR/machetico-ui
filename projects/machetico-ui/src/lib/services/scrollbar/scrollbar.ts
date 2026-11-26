import { isPlatformBrowser } from '@angular/common';
import { DestroyRef, inject, PLATFORM_ID, Service } from '@angular/core';
/**
 * Reversible activation of consumer-owned native scrollbar styling without changing scrolling behavior.
 * @class Scrollbar
 */
@Service()
export class Scrollbar {
  /**
   * SSR acquisition must not mutate the rendered document.
   * @property browser
   */
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  /**
   * One release callback per live acquisition, cleared when the owning injector is destroyed.
   * @property releases
   */
  private readonly releases = new Set<() => void>();
  /**
   * Counts overlapping users without retaining released elements.
   * @property owners
   */
  private readonly owners = new WeakMap<Element, number>();
  /**
   * Original semantic marker restored after the final owner releases a target.
   * @property original
   */
  private readonly original = new WeakMap<Element, string | null>();
  /**
   * Releases active styling scopes when Angular destroys their environment.
   * @function constructor
   */
  public constructor() {
    inject(DestroyRef).onDestroy(() => {
      for (const release of this.releases) release();
    });
  }
  /**
   * Adds a styling marker while preserving native wheel, touch, keyboard and browser scrollbar controls.
   * @function acquire
   * @param element - Native scroll container, or documentElement for page-wide application styling.
   * @returns An idempotent release function restoring the prior marker after the last owner leaves.
   */
  public acquire(element: Element): () => void {
    if (!this.browser) return () => {};
    const count = this.owners.get(element) ?? 0;
    if (count === 0) {
      this.original.set(element, element.getAttribute('data-machetico-scrollbar'));
      element.setAttribute('data-machetico-scrollbar', '');
    }
    this.owners.set(element, count + 1);
    let released = false;
    const release = (): void => {
      if (released) return;
      released = true;
      this.releases.delete(release);
      const remaining = (this.owners.get(element) ?? 1) - 1;
      if (remaining > 0) {
        this.owners.set(element, remaining);
        return;
      }
      const original = this.original.get(element);
      if (original === null || original === undefined)
        element.removeAttribute('data-machetico-scrollbar');
      else element.setAttribute('data-machetico-scrollbar', original);
      this.owners.delete(element);
      this.original.delete(element);
    };
    this.releases.add(release);
    return release;
  }
}
