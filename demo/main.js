import '@angular/localize/init';
import '@angular/compiler';
import {
  bootstrapApplication,
  provideClientHydration,
  withI18nSupport,
  withNoHttpTransferCache,
} from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { DocumentationApp } from './app';
import { routes } from './app.routes';
const hydration =
  document.documentElement.dataset.renderMode === 'ssr'
    ? [provideClientHydration(withI18nSupport(), withNoHttpTransferCache())]
    : [];
bootstrapApplication(DocumentationApp, {
  providers: [
    provideRouter(
      routes,
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
    ),
    ...hydration,
  ],
})
  .then((app) =>
    app.whenStable().then(() => (document.documentElement.dataset.bootstrapped = 'true')),
  )
  .catch((error) => console.error(error));
