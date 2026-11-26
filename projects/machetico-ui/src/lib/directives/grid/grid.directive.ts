import { Directive, input } from '@angular/core';

/**
 * Grid exposes semantic state; consumers own styling.
 * @class Grid
 */
@Directive({
  selector: '[macheticoGrid]',
  host: {
    '[attr.data-gridcolumns]': 'macheticoGridColumns()',
    '[attr.data-gridgap]': 'macheticoGridGap()',
  },
})
export class Grid {
  /**
   * Requested column count.
   * @property macheticoGridColumns
   */
  public readonly macheticoGridColumns = input(1);

  /**
   * Requested spacing variant.
   * @property macheticoGridGap
   */
  public readonly macheticoGridGap = input<string>('md');
}
