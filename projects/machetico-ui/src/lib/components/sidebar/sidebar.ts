import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';
import { Dialog } from '../dialog/dialog';

/**
 * Sidebar owns reusable visual interactions; consumers own data and persistence.
 * @class Sidebar
 */
@Component({
  selector: 'machetico-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar.html',
  imports: [Dialog],
})
export class Sidebar {
  /**
   * Accessible title for the navigation panel.
   * @property title
   */
  public readonly title = input.required<string>();

  /**
   * Whether the parent has opened this panel.
   * @property open
   */
  public readonly open = model(false);

  /**
   * Physical screen edge for this sidebar.
   * @property side
   */
  public readonly side = input<'left' | 'right'>('left');

  /**
   * Prevents dismissal while a consumer action is pending.
   * @property busy
   */
  public readonly busy = input(false);

  /**
   * Emits after an allowed dismissal.
   * @property closed
   */
  public readonly closed = output<void>();

  /**
   * Closes the controlled panel after the dialog releases focus and scroll.
   * @function dismiss
   */
  public dismiss(): void {
    if (this.busy()) return;
    this.open.set(false);
    this.closed.emit();
  }
}
