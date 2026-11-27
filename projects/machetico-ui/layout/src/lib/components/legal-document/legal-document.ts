import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import type { DocumentSection } from 'machetico-ui/core';
/**
 * Versioned document presentation; rendering and print intent never imply official validity or approval.
 * @class LegalDocument
 */
@Component({
  selector: 'machetico-legal-document',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './legal-document.html',
})
export class LegalDocument {
  /**
   * Document title supplied by its owner.
   * @property title
   */
  public readonly title = input.required<string>();

  /**
   * Immutable version label selected by the application.
   * @property version
   */
  public readonly version = input.required<string>();

  /**
   * Already formatted effective or revision date; no clock is read.
   * @property updatedAt
   */
  public readonly updatedAt = input('');

  /**
   * Consumer-owned text projections.
   * @property sections
   */
  public readonly sections = input.required<readonly DocumentSection[]>();

  /**
   * Optional review or completeness notice supplied by the owner.
   * @property notice
   */
  public readonly notice = input('');

  /**
   * Text for the print intent action.
   * @property printLabel
   */
  public readonly printLabel = input('Guardar o imprimir');

  /**
   * Print intent; the application controls browser printing or export.
   * @property printRequested
   */
  public readonly printRequested = output<void>();
}
