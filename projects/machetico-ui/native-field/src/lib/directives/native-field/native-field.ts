import {
  booleanAttribute,
  DestroyRef,
  Directive,
  DoCheck,
  ElementRef,
  inject,
  input,
  OnInit,
  Renderer2,
  signal,
} from '@angular/core';

/**
 * Shares native constraint-validation presentation without loading Angular Forms or replacing value accessors.
 * Applications own labels, values, Angular validators and custom server errors through their existing bindings.
 * @class NativeField
 */
@Directive({
  selector: 'input[macheticoField], select[macheticoField], textarea[macheticoField]',
  host: {
    '[attr.data-field-invalid]': 'invalid() ? true : null',
    '(blur)': 'touch()',
  },
})
export class NativeField implements DoCheck, OnInit {
  /**
   * Leaves aria-invalid to an existing application binding when false.
   * @property manageAria
   */
  public readonly manageAria = input(true, {
    alias: 'macheticoFieldAria',
    transform: booleanAttribute,
  });
  /**
   * Native control retains its own validity, name and value accessor.
   * @property element
   */
  private readonly element =
    inject<ElementRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>>(ElementRef);
  /**
   * SSR-compatible attribute writer.
   * @property renderer
   */
  private readonly renderer = inject(Renderer2);
  /**
   * Angular ownership for the native form reset listener.
   * @property destroyRef
   */
  private readonly destroyRef = inject(DestroyRef);
  /**
   * Whether the user has left this control since the most recent native form reset.
   * @property touched
   */
  private touched = false;
  /**
   * Interacted native constraint failure; custom Angular/server validation stays application-owned.
   * @property invalid
   */
  public readonly invalid = signal(false);
  /**
   * Registers native reset cleanup without starting browser-only APIs during SSR.
   * @function ngOnInit
   */
  public ngOnInit(): void {
    const form = this.element.nativeElement.form;
    if (!form) return;
    const reset = (): void => {
      this.touched = false;
      this.ngDoCheck();
    };
    form.addEventListener('reset', reset);
    this.destroyRef.onDestroy(() => form.removeEventListener('reset', reset));
  }
  /**
   * Records explicit user interaction without changing form values or Angular control state.
   * @function touch
   */
  public touch(): void {
    this.touched = true;
    this.ngDoCheck();
  }
  /**
   * Reflects native constraints after interaction; never substitutes application business validation.
   * @function ngDoCheck
   */
  public ngDoCheck(): void {
    const control = this.element.nativeElement;
    this.invalid.set(this.touched && !!control.validity && !control.validity.valid);
    if (!this.manageAria()) return;
    if (this.invalid()) this.renderer.setAttribute(control, 'aria-invalid', 'true');
    else this.renderer.removeAttribute(control, 'aria-invalid');
  }
}
