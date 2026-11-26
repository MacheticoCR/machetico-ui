import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeading, Alert, Card } from 'machetico-ui';
import { serviceCatalog } from '../../../../service-catalog';
import template from './services.html?raw';
/**
 * Responsibility index linking to individual lazy service documentation pages.
 * @class ServicesDocs
 */
export class ServicesDocs {
  /**
   * Service metadata preserving the distinction between exported and internal responsibilities.
   * @property services
   */
  services = serviceCatalog;
}
Component({
  selector: 'docs-services',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PageHeading, Alert, Card],
  template,
})(ServicesDocs);
