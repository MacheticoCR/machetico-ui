import {
  BootstrapContext,
  bootstrapApplication,
  provideClientHydration,
  withNoHttpTransferCache,
  withI18nSupport,
} from '@angular/platform-browser';
import { provideServerRendering, withRoutes, RenderMode } from '@angular/ssr';
import { App } from './app';
import { providers } from './providers';
/**
 * Renders only synthetic package examples; no application endpoint is read during prerendering.
 * @function bootstrap
 * @param context - Angular-owned server bootstrap context.
 * @returns The isolated application instance used by the SSR builder.
 */
export default function bootstrap(context: BootstrapContext) {
  return bootstrapApplication(
    App,
    {
      providers: [
        ...providers,
        provideClientHydration(withI18nSupport(), withNoHttpTransferCache()),
        provideServerRendering(withRoutes([{ path: '**', renderMode: RenderMode.Prerender }])),
      ],
    },
    context,
  );
}
