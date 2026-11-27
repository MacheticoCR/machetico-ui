import { Combobox, ComboboxPopup, ComboboxWidget } from '@angular/aria/combobox';
import { Listbox, Option } from '@angular/aria/listbox';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Select } from '../select/select';

/**
 * Searchable choice control sharing Select's overlay, typed values and ARIA-owned interactions.
 * Filtering is local presentation only; applications own remote reads and domain option mapping.
 * @class SearchSelect
 * @typeParam T - Immutable consumer-owned choice value.
 */
@Component({
  selector: 'machetico-search-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Combobox, ComboboxPopup, ComboboxWidget, Listbox, Option],
  templateUrl: './search-select.html',
})
export class SearchSelect<T extends string = string>
  extends Select<T>
  implements OnInit, OnChanges
{
  /**
   * Editable query; typing does not commit a selected domain value.
   * @property query
   */
  public readonly query = model('');
  /**
   * Hint displayed while the editable field has no text.
   * @property placeholder
   */
  public readonly placeholder = input('');
  /**
   * Confirmed display label; absence leaves the native placeholder visible.
   * @property selectedLabel
   */
  public override readonly selectedLabel = computed(
    () => this.options().find((option) => option.value === this.value())?.label ?? '',
  );
  /**
   * Consumer-owned announcement for an unmatched query.
   * @property emptyLabel
   */
  public readonly emptyLabel = input('Sin opciones.');
  /**
   * Case-insensitive local matches; a collapsed selected label retains the full option set.
   * @property filteredOptions
   */
  public readonly filteredOptions = computed(() => {
    const query = this.query().trim().toLocaleLowerCase();
    if (!query || query === this.selectedLabel().toLocaleLowerCase()) return this.options();
    return this.options().filter((option) => option.label.toLocaleLowerCase().includes(query));
  });
  /**
   * Initializes the editable display after required consumer inputs are available.
   * @function ngOnInit
   */
  public ngOnInit(): void {
    this.query.set(this.selectedLabel());
  }
  /**
   * Reflects externally changed choices while preserving an active user's search.
   * @function ngOnChanges
   */
  public ngOnChanges(changes: SimpleChanges): void {
    if ((changes['value'] || changes['options']) && !this.expanded())
      this.query.set(this.selectedLabel());
  }
  /**
   * Restores the committed label after ARIA closes the editable popup.
   * @function expandedChanged
   * @param expanded - Whether ARIA reports an open popup.
   */
  public expandedChanged(expanded: boolean): void {
    if (!expanded) this.query.set(this.selectedLabel());
  }
  /**
   * Commits an ARIA choice through the inherited Select contract and synchronizes its label.
   * @function select
   * @param values - Explicitly selected ARIA values; an empty event preserves the current value.
   */
  public override select(values: T[]): void {
    if (this.disabled() || values[0] === undefined) return;
    super.select(values);
    this.query.set(this.selectedLabel());
  }
  /**
   * Opens the popup with an empty query without changing the selected domain value.
   * @function focus
   */
  public focus(): void {
    this.query.set('');
    this.expanded.set(true);
  }
}
