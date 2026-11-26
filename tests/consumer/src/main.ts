import {
  bootstrapApplication,
  provideClientHydration,
  withNoHttpTransferCache,
  withI18nSupport,
} from '@angular/platform-browser';
import { App } from './app';
import { providers } from './providers';
void bootstrapApplication(App, {
  providers: [...providers, provideClientHydration(withI18nSupport(), withNoHttpTransferCache())],
});
