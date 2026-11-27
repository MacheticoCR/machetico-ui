import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';
import type { TableColumn, TableSort } from 'machetico-ui/core';
import { NativeTable } from 'machetico-ui/surface';

/**
 * Native data table with caller-owned rows, accessible read states and immutable sorting intent.
 * @class Table
 * @typeParam T - Consumer-owned row contract.
 */
@Component({
  selector: 'machetico-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './table.html',
})
export class Table<T> extends NativeTable {
  /**
   * Caption identifying the table to assistive technology.
   * @property caption
   */
  public readonly caption = input.required<string>();

  /**
   * Immutable display rows owned by the consumer.
   * @property rows
   */
  public readonly rows = input.required<readonly T[]>();

  /**
   * Visible columns with explicit display accessors.
   * @property columns
   */
  public readonly columns = input.required<readonly TableColumn<T>[]>();

  /**
   * Stable unique row identity supplied by the application.
   * @property rowKey
   */
  public readonly rowKey = input.required<(row: T) => string | number>();

  /**
   * Whether a read is pending.
   * @property loading
   */
  public override readonly loading = input(false);

  /**
   * Recoverable read failure message.
   * @property error
   */
  public readonly error = input('');

  /**
   * Message for an empty successful result.
   * @property emptyMessage
   */
  public readonly emptyMessage = input('Sin resultados.');

  /**
   * Loading announcement supplied by the consumer.
   * @property loadingLabel
   */
  public readonly loadingLabel = input('Cargando…');

  /**
   * Accessible retry action label.
   * @property retryLabel
   */
  public readonly retryLabel = input('Reintentar');

  /**
   * Current ordering supplied by the application.
   * @property sort
   */
  public override readonly sort = input<TableSort | null>(null);

  /**
   * Requested ordering; does not issue network commands.
   * @property sortChanged
   */
  public override readonly sortChanged = output<TableSort>();

  /**
   * Explicit retry intent.
   * @property retryRequested
   */
  public readonly retryRequested = output<void>();

  /**
   * Requests a toggled sort for an enabled column exactly once per activation.
   * @function changeSort
   * @param column - Consumer-provided visible column.
   */
  public changeSort(column: TableColumn<T>): void {
    if (this.loading() || !column.sortable) return;
    this.requestSort(column.key);
  }
}
