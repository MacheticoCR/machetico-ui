import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { DestroyRef, inject, PLATFORM_ID, Service } from '@angular/core';

/**
 * Reference-counted browser document scroll leases; server acquisition is a no-op.
 *
 * @class ScrollLock
 * @functions `acquire`
 *
 * @example
 * ```ts
 * import { inject } from '@angular/core';
 * const service = inject(ScrollLock);
 * ```
 */
@Service()
export class ScrollLock {
  /**
   * Prevents server renders from changing their document's scrolling styles.
   * @property browser
   */
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));

  /**
   * Restores owned browser styles if the environment is destroyed while a lease remains.
   * @function constructor
   */
  public constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.restore?.();
      this.restore = undefined;
      this.locks = 0;
    });
  }

  /**
   * Injected browser document, allowing tests without relying on a hidden global.
   *
   * @property document
   */
  private readonly document = inject(DOCUMENT);

  /**
   * Number of active modal owners currently holding the shared document scroll lock.
   *
   * @property locks
   */
  private locks = 0;

  /**
   * Restores the document scroll position and original inline style values after the last release.
   *
   * @property restore
   * @remarks
   * Optional: absence is not automatically equivalent to zero, false, or an empty string.
   */
  private restore?: () => void;

  /**
   * Locks document scrolling until every modal owner releases its lease.
   *
   * @function acquire
   * @returns The `() => void` value produced by this operation.
   *
   */
  public acquire(): () => void {
    if (!this.browser) return () => {};
    if (this.locks++ === 0) {
      const { documentElement: root, body, defaultView: view } = this.document;
      const x = view?.scrollX ?? 0;
      const y = view?.scrollY ?? 0;
      const rootProperties = ['overflow', 'scrollbar-gutter', 'scroll-behavior'];
      const bodyProperties = ['position', 'top', 'left', 'width', 'overflow'];
      const snapshots = [
        ...rootProperties.map((name) => ({
          style: root.style,
          name,
          value: root.style.getPropertyValue(name),
          priority: root.style.getPropertyPriority(name),
        })),
        ...bodyProperties.map((name) => ({
          style: body.style,
          name,
          value: body.style.getPropertyValue(name),
          priority: body.style.getPropertyPriority(name),
        })),
      ];
      root.style.setProperty('overflow', 'hidden');
      root.style.setProperty('scrollbar-gutter', 'stable');
      root.style.setProperty('scroll-behavior', 'auto');
      body.style.setProperty('position', 'fixed');
      body.style.setProperty('top', `${-y}px`);
      body.style.setProperty('left', `${-x}px`);
      body.style.setProperty('width', '100%');
      body.style.setProperty('overflow', 'hidden');
      this.restore = (): void => {
        for (const entry of snapshots.filter((item) => item.name !== 'scroll-behavior')) {
          if (entry.value) entry.style.setProperty(entry.name, entry.value, entry.priority);
          else entry.style.removeProperty(entry.name);
        }
        view?.scrollTo({ left: x, top: y, behavior: 'instant' });
        const scroll = snapshots.find((item) => item.name === 'scroll-behavior')!;
        if (scroll.value) scroll.style.setProperty(scroll.name, scroll.value, scroll.priority);
        else scroll.style.removeProperty(scroll.name);
      };
    }
    let released = false;
    return (): void => {
      if (released) return;
      released = true;
      if (this.locks === 0) return;
      if (--this.locks === 0) {
        this.restore?.();
        this.restore = undefined;
      }
    };
  }
}
