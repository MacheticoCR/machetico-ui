import { Toolbar, ToolbarWidget } from '@angular/aria/toolbar';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

/**
 * Angular ARIA toolbar that emits one-based page selection without owning result reads.
 *
 * @class Pagination
 */
@Component({
  selector: 'machetico-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Toolbar, ToolbarWidget],
  host: {},
  templateUrl: './pagination.html',
})
export class Pagination {
  /**
   * Requested or returned page number, starting at one.
   *
   * @property page
   */
  public readonly page = input(1);

  /**
   * Total number of result entries supplied by the consuming page.
   *
   * @property total
   */
  public readonly total = input(0);

  /**
   * Number of entries per page, bounded by the server.
   *
   * @property pageSize
   */
  public readonly pageSize = input(9);

  /**
   * Whether an action is pending and must not be repeated before its result is known.
   *
   * @property busy
   */
  public readonly busy = input(false);

  /**
   * Visible label, configured or translated according to its source.
   *
   * @property label
   */
  public readonly label = input('Páginas de resultados');

  /**
   * page changed output emitted to the owning component through Angular's output contract.
   *
   * @property pageChanged
   */
  public readonly pageChanged = output<number>();

  /**
   * Derived page count value recalculated when its signal dependencies change; it does not persist
   * data.
   *
   * @property pageCount
   */
  public readonly pageCount = computed(() =>
    Math.ceil(Math.max(0, this.total()) / Math.max(1, this.pageSize())),
  );

  /**
   * Derived current value recalculated when its signal dependencies change; it does not persist data.
   *
   * @property current
   */
  public readonly current = computed(() => Math.max(1, Math.min(this.page(), this.pageCount())));

  /**
   * Derived first value recalculated when its signal dependencies change; it does not persist data.
   *
   * @property first
   */
  public readonly first = computed(() => (this.current() - 1) * this.pageSize() + 1);

  /**
   * Derived last value recalculated when its signal dependencies change; it does not persist data.
   *
   * @property last
   */
  public readonly last = computed(() => Math.min(this.current() * this.pageSize(), this.total()));

  /**
   * Derived numbers value recalculated when its signal dependencies change; it does not persist data.
   *
   * @property numbers
   */
  public readonly numbers = computed(() => {
    const start = Math.max(1, Math.min(this.current() - 2, this.pageCount() - 4));
    return Array.from({ length: Math.min(5, this.pageCount()) }, (_, i) => start + i);
  });
}
