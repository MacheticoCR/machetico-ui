import { InjectionToken, makeEnvironmentProviders, type EnvironmentProviders } from '@angular/core';
import type { ApiConfig } from './interfaces';
/**
 * Configuration isolated to the consuming application's injector.
 * @property API_CONFIG
 */
export const API_CONFIG = new InjectionToken<ApiConfig>('MACHETICO_API_CONFIG', {
  providedIn: 'root',
  factory: () => ({}),
});
/**
 * Configures the transport without installing interceptors or changing application authentication.
 * @function provideMacheticoApi
 * @param config - Application-owned gateway and credential policy.
 * @returns Providers scoped to the consuming environment injector.
 */
export function provideMacheticoApi(config: ApiConfig): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: API_CONFIG, useValue: config }]);
}
