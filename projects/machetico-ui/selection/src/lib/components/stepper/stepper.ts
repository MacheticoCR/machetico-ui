import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { Tabs, TabList, Tab, TabPanel, TabContent } from '@angular/aria/tabs';
import type { PresentationStep } from 'machetico-ui/core';
/**
 * Angular ARIA step-selection surface; validation and business completion remain consumer-owned.
 * @class Stepper
 */
@Component({
  selector: 'machetico-stepper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stepper.html',
  imports: [Tabs, TabList, Tab, TabPanel, TabContent],
})
export class Stepper {
  /**
   * Accessible name for the step selector.
   * @property label
   */
  public readonly label = input.required<string>();

  /**
   * Immutable presentation steps.
   * @property steps
   */
  public readonly steps = input.required<readonly PresentationStep[]>();

  /**
   * Selected step identifier owned by the consumer.
   * @property value
   */
  public readonly value = model<string | undefined>(undefined);
}
