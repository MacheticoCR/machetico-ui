import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PageSkeleton } from '../page-skeleton/page-skeleton';

/**
 * Labelled section wrapper around the shared loading placeholder structure.
 *
 * @class SectionSkeleton
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'machetico-section-skeleton',
  imports: [PageSkeleton],
  host: {},
  templateUrl: './section-skeleton.html',
})
export class SectionSkeleton {
  /**
   * Visible label, configured or translated according to its source.
   *
   * @property label
   */
  public readonly label = input('Cargando sección');

  /**
   * Number of placeholder cards requested by the consuming view.
   *
   * @property count
   */
  public readonly count = input(3);
}
