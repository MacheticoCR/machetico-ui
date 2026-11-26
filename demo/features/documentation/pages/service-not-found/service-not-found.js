import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeading, EmptyState } from 'machetico-ui';
import template from './service-not-found.html?raw';
/**
 * Explicit empty state for unknown service documentation deep links.
 * @class ServiceNotFoundDocs
 */
export class ServiceNotFoundDocs {}
Component({
  selector: 'docs-service-not-found',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PageHeading, EmptyState],
  template,
})(ServiceNotFoundDocs);
