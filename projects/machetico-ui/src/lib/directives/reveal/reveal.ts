import { afterRenderEffect, Directive, ElementRef, inject, input, signal } from '@angular/core';
import { ScrollReveal } from '../../services';
/**
 * Progressive viewport reveal delegated to the scoped shared service; SSR content remains visible.
 * @class Reveal
 */
@Directive({
  selector: '[macheticoReveal]',
  providers: [
    {
      provide: ScrollReveal,
      useClass: ScrollReveal,
    },
  ],
  host: {
    '[attr.data-reveal]': 'state()',
  },
})
export class Reveal {
  /**
   * Enables browser viewport enhancement without changing initial server content.
   * @property enabled
   */
  public readonly enabled = input(true, { alias: 'macheticoReveal' });
  /**
   * Semantic visibility state styled by the consuming application.
   * @property state
   */
  public readonly state = signal('visible');
  /**
   * Native element owned by Angular.
   * @property element
   */
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  /**
   * Scoped observer ownership shared with the public service implementation.
   * @property reveal
   */
  private readonly reveal = inject(ScrollReveal);
  /**
   * Installs browser observation after rendering and releases it on input change or destruction.
   * @function constructor
   */
  public constructor() {
    afterRenderEffect((cleanup) => {
      if (!this.enabled()) return;
      this.state.set('pending');
      const release = this.reveal.observe(this.element.nativeElement, () =>
        this.state.set('visible'),
      );
      cleanup(() => {
        release();
        this.state.set('visible');
      });
    });
  }
}
