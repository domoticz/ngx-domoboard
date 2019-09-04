import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, ApplicationRef } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { RouterModule } from '@angular/router';

import { NbThemeModule, NbLayoutModule, NbToastrModule, NbDialogModule, NbButtonModule } from '@nebular/theme';

import { SharedModule } from '@nd/shared/shared.module';
import { GlobalErrorHandler } from '@nd/core/global-error-handler';
import { httpInterceptorProviders } from '@nd/core/http-interceptors';
import { CUSTOM_COSMIC_THEME } from '@nd/core/theme.custom-cosmic';

import { AppComponent } from './app.component';
import { routes } from './app.routes';

import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes, {
      useHash: environment.domoticz,
      scrollPositionRestoration: 'enabled'
    }),
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: 'custom-cosmic' }, [CUSTOM_COSMIC_THEME]),
    NbLayoutModule,
    NbDialogModule.forRoot(),
    NbButtonModule,
    SharedModule,
    ServiceWorkerModule.register('/ngx-domoboard/ngsw-worker.js', { enabled: environment.production }),
    NbToastrModule.forRoot()
  ],
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    httpInterceptorProviders
  ],
  bootstrap: [AppComponent],
  entryComponents: [AppComponent]
})
export class AppModule {

  app: ApplicationRef;

  ngDoBootstrap(app: ApplicationRef) {
    this.app = app;
  }

 }
