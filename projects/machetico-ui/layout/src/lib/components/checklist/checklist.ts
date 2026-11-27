import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import type { ChecklistItem } from 'machetico-ui/core';
/**
 * Ordered, read-only progress presentation; the consumer owns every completion decision.
 * @class Checklist
 */
@Component({
  selector: 'machetico-checklist',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './checklist.html',
})
export class Checklist {
  /**
   * Accessible description of the step list.
   * @property label
   */
  public readonly label = input.required<string>();

  /**
   * Immutable display-only checklist steps.
   * @property items
   */
  public readonly items = input.required<readonly ChecklistItem[]>();
}
