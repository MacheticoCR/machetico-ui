import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Static placeholder structure with an accessible loading announcement and consumer-owned visual styling.
 *
 * @class PageSkeleton
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'machetico-page-skeleton',
  host: {},
  templateUrl: './page-skeleton.html',
})
export class PageSkeleton {
  /**
   * Semantic placeholder composition requested by the consuming page.
   *
   * @property variant
   */
  public readonly variant = input<'landing' | 'account' | 'admin' | 'section'>('landing');

  /**
   * Number of placeholder cards requested by the consuming view.
   *
   * @property count
   */
  public readonly count = input(6);

  /**
   * Derived cards value recalculated when its signal dependencies change; it does not persist data.
   *
   * @property cards
   */
  public readonly cards = computed(() => Array.from({ length: this.count() }, (_, i) => i));
}
