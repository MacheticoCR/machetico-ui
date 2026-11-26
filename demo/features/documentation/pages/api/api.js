import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeading, Panel, Alert, Table } from 'machetico-ui';
import { usageExamples } from '../../../../usage-examples';
import template from './api.html?raw';

/**
 * Individual documentation and synthetic demonstration of the Api responsibility.
 * @class ApiDocs
 */
export class ApiDocs {
  /**
   * Copyable consumer-owned installation and integration examples.
   * @property examples
   */
  examples = usageExamples;
  /**
   * Verified public transport signatures and ownership boundaries.
   * @property methods
   */
  methods = [
    { name: 'read(path, parse)', behavior: 'GET reactivo; cancela lecturas obsoletas.' },
    { name: 'readForm(path, body, parse)', behavior: 'POST solo de consulta; undefined cancela.' },
    { name: 'readFile(path)', behavior: 'Lectura Blob sin transferencia SSR.' },
    {
      name: 'request(path, method, body, parse, options?)',
      behavior: 'POST, PUT, PATCH o DELETE explícito; una ejecución, sin replay ni reintentos.',
    },
  ];
  /**
   * Method-reference columns rendered with the shared library Table.
   * @property columns
   */
  columns = [
    { key: 'name', label: 'Método', value: (row) => row.name },
    { key: 'behavior', label: 'Responsabilidad', value: (row) => row.behavior },
  ];
  /**
   * Stable method identity for reference rows.
   * @property key
   */
  key = (row) => row.name;
}
Component({
  selector: 'docs-api',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PageHeading, Panel, Alert, Table],
  template,
})(ApiDocs);
