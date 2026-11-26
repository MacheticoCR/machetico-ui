import '@angular/platform-server/init';
import '@angular/localize/init';
import '@angular/compiler';
import { renderApplication, provideServerRendering } from '@angular/platform-server';
import {
  bootstrapApplication,
  provideClientHydration,
  withI18nSupport,
  withNoHttpTransferCache,
} from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { DocumentationApp } from './app';
import { routes } from './app.routes';
// Evaluate the public server provider configuration before renderApplication creates a platform.
const serverRendering = provideServerRendering();
/**
 * Renders the documentation in a fresh Angular application injector for each request.
 * @function renderDocumentation
 * @param document - Vite-transformed application document.
 * @param url - Current local documentation URL, including its deep link.
 * @returns SSR HTML with Angular hydration annotations.
 */
export function renderDocumentation(document, url) {
  return renderApplication(
    (context) =>
      bootstrapApplication(
        DocumentationApp,
        {
          providers: [
            serverRendering,
            provideRouter(routes),
            provideClientHydration(withI18nSupport(), withNoHttpTransferCache()),
          ],
        },
        context,
      ),
    { document, url, allowedHosts: ['127.0.0.1', 'localhost'] },
  );
}
