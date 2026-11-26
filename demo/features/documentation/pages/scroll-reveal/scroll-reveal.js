import { ChangeDetectionStrategy, Component, signal, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeading, Panel, Button, Card, ScrollReveal } from 'machetico-ui';
import { usageExamples } from '../../../../usage-examples';
import template from './scroll-reveal.html?raw';

/**
 * Individual documentation and synthetic demonstration of the ScrollReveal responsibility.
 * @class ScrollRevealDocs
 */
export class ScrollRevealDocs {
  /**
   * Copyable consumer-owned installation and integration examples.
   * @property examples
   */
  examples = usageExamples;
  /**
   * Component-scoped observer and animation ownership.
   * @property reveal
   */
  reveal = inject(ScrollReveal);
  /**
   * Fresh immutable identities allow explicit replay without changing library state.
   * @property generation
   */
  generation = signal(0);
  /**
   * Synthetic cards recreated only after the explicit replay action.
   * @property cards
   */
  cards = computed(() =>
    [0, 1, 2].map((column) => ({ id: this.generation() + '-' + column, column })),
  );
  /**
   * Caller-owned visual frames; the library supplies no transform, color or opacity identity.
   * @property motion
   */
  motion = {
    keyframes: [
      { opacity: 0, transform: 'translateY(14px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
    duration: 320,
    stagger: 45,
  };
}
Component({
  selector: 'docs-scroll-reveal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PageHeading, Panel, Button, Card],
  providers: [ScrollReveal],
  template,
})(ScrollRevealDocs);
