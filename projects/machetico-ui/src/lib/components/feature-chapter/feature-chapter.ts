import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
} from '@angular/core';

/**
 * Generic feature chapter with projected media and actions, without industry routes or checkout rules.
 * @class FeatureChapter
 */
@Component({
  selector: 'machetico-feature-chapter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './feature-chapter.html',
})
export class FeatureChapter {
  /**
   * Feature heading supplied by the consumer.
   * @property title
   */
  public readonly title = input.required<string>();

  /**
   * Feature summary text.
   * @property description
   */
  public readonly description = input('');

  /**
   * Immutable feature descriptions.
   * @property features
   */
  public readonly features = input<readonly string[]>([]);

  /**
   * Semantic content alignment exposed for consumer styling.
   * @property align
   */
  public readonly align = input<'left' | 'right'>('left');
}
