import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button } from 'machetico-ui/button';

/**
 * Contextual failure message that emits retry intent to the resource-owning consumer.
 *
 * @class DeferredError
 * @functions `reload`
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {},
  imports: [Button],
  selector: 'machetico-deferred-error',
  templateUrl: './deferred-error.html',
})
export class DeferredError {
  /**
   * Retry intent handled by the resource-owning application.
   * @property retryRequested
   */
  public readonly retryRequested = output<void>();

  /**
   * Name of the unavailable section included in the accessible error message.
   *
   * @property section
   */
  public readonly section = input('esta sección');

  /**
   * Requests a retry from the consumer without reloading the application document.
   *
   * @function reload
   *
   */
  public reload(): void {
    this.retryRequested.emit();
  }
}
