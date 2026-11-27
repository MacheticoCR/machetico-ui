import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Alert } from '../alert/alert';

/**
 * Accessible error and confirmation messages supplied by the operation-owning consumer.
 *
 * @class Feedback
 */
@Component({
  selector: 'machetico-feedback',
  imports: [Alert],
  templateUrl: './feedback.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Feedback {
  /**
   * Recoverable error state or message excluding credentials and server internals.
   *
   * @property error
   */
  public readonly error = input('');

  /**
   * Successful or informational operation message supplied by the consumer.
   *
   * @property notice
   */
  public readonly notice = input('');
}
