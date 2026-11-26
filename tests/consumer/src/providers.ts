import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideMacheticoApi } from 'machetico-ui/api';
/**
 * Application-owned optional transport setup; no resource or command is executed by this fixture.
 * @property providers
 */
export const providers = [
  provideRouter([
    { path: '', loadComponent: () => import('./consumer-page').then((page) => page.ConsumerPage) },
  ]),
  provideHttpClient(),
  provideMacheticoApi({ baseUrl: '/api', credentials: 'same-origin' }),
];
