import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Combobox, ComboboxPopup, ComboboxWidget } from '@angular/aria/combobox';
import { Listbox, Option } from '@angular/aria/listbox';
import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  model,
  PLATFORM_ID,
  signal,
  viewChild,
} from '@angular/core';
import type { Choice } from '../../interfaces';

/**
 * Reusable headless presentation component owned by Angular.
 *
 * @class Select
 * @typeParam T - Caller-supplied type retained by the shared implementation.
 * @functions `select`
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'machetico-select',
  imports: [Combobox, ComboboxPopup, ComboboxWidget, Listbox, Option],
  host: {},
  templateUrl: './select.html',
})
export class Select<T extends string = string> {
  /**
   * Browser-only gate for the native popup and viewport APIs.
   * @property browser
   */
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));

  /**
   * Owning document used for outside-pointer dismissal and viewport bounds.
   * @property document
   */
  private readonly document = inject(DOCUMENT);

  /**
   * Native trigger whose geometry anchors the popup.
   * @property trigger
   */
  private readonly trigger = viewChild.required<ElementRef<HTMLButtonElement>>('trigger');

  /**
   * Lazily rendered native popup; absent while collapsed and during server rendering.
   * @property popup
   */
  private readonly popup = viewChild<ElementRef<HTMLDivElement>>('popupElement');

  /**
   * Registers structural overlay work after Angular has created the ARIA popup.
   * @function constructor
   */
  public constructor() {
    afterRenderEffect((cleanup) => {
      if (!this.browser || !this.expanded()) return;
      const popup = this.popup()?.nativeElement;
      const trigger = this.trigger().nativeElement;
      const view = this.document.defaultView;
      if (!popup || !view) return;

      /**
       * Repositions the popup without taking space in the consumer layout.
       * @function position
       */
      const position = (): void => this.positionPopup(popup, trigger);

      /**
       * Dismisses only pointer events outside both popup and trigger.
       * @function dismiss
       * @param event - Pointer activation in the owning document.
       */
      const dismiss = (event: PointerEvent): void => {
        const target = event.target;
        if (target instanceof Node && !popup.contains(target) && !trigger.contains(target)) {
          this.expanded.set(false);
        }
      };

      position();
      if (typeof popup.showPopover === 'function') popup.showPopover();
      position();
      view.addEventListener('resize', position);
      this.document.addEventListener('scroll', position, true);
      this.document.addEventListener('pointerdown', dismiss, true);
      cleanup(() => {
        view.removeEventListener('resize', position);
        this.document.removeEventListener('scroll', position, true);
        this.document.removeEventListener('pointerdown', dismiss, true);
        if (typeof popup.hidePopover === 'function' && popup.matches(':popover-open'))
          popup.hidePopover();
      });
    });
  }

  /**
   * Anchors the popup to its trigger and chooses the viewport side with available space.
   * Only structural geometry is set; consumer visual styles remain untouched.
   * @function positionPopup
   * @param popup - Lazily created ARIA listbox element.
   * @param trigger - Native combobox trigger.
   */
  private positionPopup(popup: HTMLDivElement, trigger: HTMLButtonElement): void {
    const bounds = trigger.getBoundingClientRect();
    const viewport = this.document.documentElement;
    const gap = 4;
    const margin = 8;
    const below = viewport.clientHeight - bounds.bottom - margin - gap;
    const above = bounds.top - margin - gap;
    const openAbove = below < 160 && above > below;
    Object.assign(popup.style, {
      position: 'fixed',
      inset: 'auto',
      margin: '0',
      minWidth: Math.min(bounds.width, Math.max(0, viewport.clientWidth - margin * 2)) + 'px',
      maxWidth: Math.max(0, viewport.clientWidth - margin * 2) + 'px',
      maxHeight: Math.max(0, openAbove ? above : below) + 'px',
      overflowY: 'auto',
      zIndex: '1000',
    });
    const width = Math.max(bounds.width, popup.getBoundingClientRect().width);
    popup.style.left =
      Math.max(margin, Math.min(bounds.left, viewport.clientWidth - width - margin)) + 'px';
    popup.style.top =
      (openAbove ? Math.max(margin, bounds.top - popup.offsetHeight - gap) : bounds.bottom + gap) +
      'px';
  }

  /**
   * Visible label, configured or translated according to its source.
   *
   * @property label
   */
  public readonly label = input.required<string>();

  /**
   * Allowed choices or explicit operation configuration, according to the containing contract.
   *
   * @property options
   */
  public readonly options = input.required<readonly Choice<T>[]>();

  /**
   * Current typed value received from or emitted to the consuming contract.
   *
   * @property value
   */
  public readonly value = model.required<T>();

  /**
   * Whether interaction is disabled; it does not grant or revoke server permissions.
   *
   * @property disabled
   */
  public readonly disabled = input(false);

  /**
   * Whether the popup is open; accessibility directives own its keyboard and focus behavior.
   *
   * @property expanded
   */
  public readonly expanded = signal(false);

  /**
   * Display label derived from the selected value and currently available choices.
   *
   * @property selectedLabel
   */
  public readonly selectedLabel = computed(
    () => this.options().find((option) => option.value === this.value())?.label ?? 'Seleccionar',
  );

  /**
   * Updates the selected value.
   *
   * @function select
   * @param values - Selected values supplied by the Angular ARIA listbox.
   *
   */
  public select(values: T[]): void {
    if (this.disabled() || values[0] === undefined) return;
    this.value.set(values[0]);
    this.expanded.set(false);
  }
}
