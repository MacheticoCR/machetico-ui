import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  viewChild,
} from '@angular/core';
import { ScrollLock, ViewIds } from '../../services';
import { Icon } from '../icon/icon';

/**
 * Reusable headless presentation component owned by Angular.
 *
 * @class Dialog
 * @functions `ngAfterViewInit`, `ngOnDestroy`, `handleClosed`, `close`, `cancel`, `backdrop`
 */
@Component({
  selector: 'machetico-dialog',
  imports: [Icon],
  templateUrl: './dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dialog implements AfterViewInit, OnDestroy {
  /**
   * Whether native browser dialog and focus APIs are available for this view.
   * @property browser
   */
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));

  /**
   * Application-owned identifier sequence matching server and browser view creation.
   *
   * @property ids
   */
  private readonly ids = inject(ViewIds);

  /**
   * Stable heading identifier connecting the modal to its accessible name.
   *
   * @property titleId
   */
  public readonly titleId = this.ids.next('machetico-dialog-title');

  /**
   * Previously focused element restored when the modal is destroyed.
   *
   * @property opener
   */
  private opener: Element | null = null;

  /**
   * Injected scroll lock dependency used by this instance.
   *
   * @property scrollLock
   */
  private readonly scrollLock = inject(ScrollLock);

  /**
   * Idempotent release callback for this modal's document scroll ownership.
   *
   * @property releaseScroll
   * @remarks
   * Optional: absence is not automatically equivalent to zero, false, or an empty string.
   */
  private releaseScroll?: () => void;

  /**
   * Angular view query for the native HTML dialog element.
   *
   * @property dialog
   */
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  /**
   * Visible title of the associated record or published content.
   *
   * @property title
   */
  public readonly title = input.required<string>();

  /**
   * Whether an action is pending and must not be repeated before its result is known.
   *
   * @property busy
   */
  public readonly busy = input(false);

  /**
   * Semantic placement exposed to consumer styles; it does not prescribe coordinates.
   *
   * @property placement
   */
  public readonly placement = input<'center' | 'sidebar'>('center');

  /**
   * Physical edge anchoring a sidebar; centered dialogs ignore this setting.
   * @property side
   */
  public readonly side = input<'left' | 'right'>('right');

  /**
   * Requests dismissal unless an action is pending.
   * @function close
   */
  public close(): void {
    if (!this.busy()) this.closed.emit();
  }

  /**
   * Dismissal intent; the owner removes the component.
   *
   * @property closed
   */
  public readonly closed = output<void>();

  /**
   * Runs component work that requires an already-created view.
   *
   * @remarks
   * It must not duplicate initial reads or repeat commerce mutations.
   *
   * @function ngAfterViewInit
   *
   */
  public ngAfterViewInit(): void {
    const element = this.dialog().nativeElement;
    this.opener = element.ownerDocument.activeElement;
    if (!this.browser) {
      element.setAttribute('open', '');
      element.setAttribute('data-ssr-dialog', '');
      return;
    }
    if (element.hasAttribute('data-ssr-dialog')) {
      element.removeAttribute('open');
      element.removeAttribute('data-ssr-dialog');
    }
    element.showModal();
    this.releaseScroll = this.scrollLock.acquire();
  }

  /**
   * Releases component-owned resources when Angular destroys the view.
   *
   * @remarks
   * Timers, observers, and listeners must not continue updating a view that is no longer active.
   *
   * @function ngOnDestroy
   *
   */
  public ngOnDestroy(): void {
    if (this.browser) this.dialog().nativeElement.close();
    this.releaseScroll?.();
    if (
      typeof HTMLElement !== 'undefined' &&
      this.opener instanceof HTMLElement &&
      this.opener.isConnected
    )
      this.opener.focus({ preventScroll: true });
  }

  /**
   * Releases this modal's scroll ownership after the native close event.
   *
   * @function handleClosed
   *
   */
  public handleClosed(): void {
    this.releaseScroll?.();
  }

  /**
   * Requests the permitted cancellation.
   *
   * @function cancel
   * @param event - Native interaction event from the owned control.
   *
   */
  public cancel(event: Event): void {
    event.preventDefault();
    this.close();
  }

  /**
   * Requests dismissal only when the pointer activation is outside the dialog content.
   *
   * @function backdrop
   * @param event - Native interaction event from the owned control.
   *
   */
  public backdrop(event: MouseEvent): void {
    const dialog = this.dialog().nativeElement;
    if (event.target !== dialog || this.busy()) return;
    const bounds = dialog.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      this.close();
  }
}
