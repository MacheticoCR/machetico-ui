import { ChangeDetectionStrategy, Component, forwardRef, input } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormControl } from '../form-control/form-control';

/**
 * Native multiline value accessor sharing the caller-owned Angular Forms validation contract.
 *
 * @class Textarea
 */
@Component({
  selector: 'machetico-textarea',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.name]': 'null',
    '[attr.id]': 'null',
  },
  templateUrl: './textarea.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Textarea),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => Textarea),
      multi: true,
    },
  ],
})
export class Textarea extends FormControl {
  /**
   * Visible textarea row count, without changing the stored text length limit.
   *
   * @property rows
   */
  public readonly rows = input<string | number | null>(null);
}
