import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Button,
  Card,
  Input,
  Textarea,
  Checkbox,
  Select,
  Slider,
  Dialog,
  Sidebar,
  Table,
  Icon,
  Pagination,
  ImageSlider,
  ScrollReveal,
  FieldGroup,
} from 'machetico-ui';
/**
 * Strict standalone AOT consumer importing only public package entry points.
 * @class ConsumerPage
 */
@Component({
  selector: 'smoke-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    Button,
    Card,
    Input,
    Textarea,
    Checkbox,
    Select,
    Slider,
    Dialog,
    Sidebar,
    Table,
    Icon,
    Pagination,
    ImageSlider,
    FieldGroup,
  ],
  providers: [ScrollReveal],
  templateUrl: './consumer-page.html',
})
export class ConsumerPage {
  /**
   * Synthetic selection owned by the consumer.
   * @property selected
   */
  public readonly selected = signal('first');
  /**
   * Consumer range model.
   * @property volume
   */
  public readonly volume = signal(30);
  /**
   * Consumer modal model remains closed during initial SSR.
   * @property open
   */
  public readonly open = signal(false);
  /**
   * Stable synthetic record identity.
   * @property rowKey
   */
  public readonly rowKey = (row: { readonly id: number }): number => row.id;
}
