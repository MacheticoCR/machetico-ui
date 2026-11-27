import { Directive, input, output } from '@angular/core';
import type { TableSort } from 'machetico-ui/core';

/**
 * Shared native-table loading semantics and immutable sorting intents, also used by Table.
 * Applications retain custom cells, row data, permissions and remote reads.
 * @class NativeTable
 */
@Directive({
  selector: 'table[macheticoTable]',
  exportAs: 'macheticoTable',
  host: {
    '[attr.aria-busy]': 'loading()',
  },
})
export class NativeTable {
  /**
   * Prevents sorting while the consumer is replacing table data.
   * @property loading
   */
  public readonly loading = input(false, { alias: 'tableLoading' });
  /**
   * Parent-owned ordering; the table never mutates records or starts a read.
   * @property sort
   */
  public readonly sort = input<TableSort | null>(null, { alias: 'tableSort' });
  /**
   * Exactly one immutable intent for an explicit sortable-header activation.
   * @property sortChanged
   */
  public readonly sortChanged = output<TableSort>({ alias: 'tableSortChanged' });
  /**
   * Toggles a column's requested direction without applying domain ordering itself.
   * @function requestSort
   * @param key - Stable consumer-owned column identifier.
   */
  public requestSort(key: string): void {
    if (this.loading()) return;
    const current = this.sort();
    this.sortChanged.emit({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    });
  }
}
