/// <reference types="cypress" />

// Required for JIT in NG-7
import 'core-js/es7/reflect';
import { ApplicationRef, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { RouterModule } from '@angular/router';

import 'zone.js';
import { AppComponent } from '@nd/app.component';
import { SharedModule } from '@nd/shared/shared.module';
import { routes } from '@nd/app.routes';

// dynamic loading based on blog post
// https://blog.angularindepth.com/how-to-manually-bootstrap-an-angular-application-9a36ccf86429

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    RouterModule.forRoot(routes),
  ],
  providers: [],
  entryComponents: [AppComponent]
})
class AppModule {
  app: ApplicationRef;
  ngDoBootstrap(app: ApplicationRef) {
    this.app = app;
  }
}

/* eslint-env mocha */
/* global cy */
describe('AppComponent', () => {
  beforeEach(() => {
    const html = `
      <!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>NgxDomoboard</title>
        <base href="/">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="icon" type="image/x-icon" href="favicon.ico">
        <link rel="manifest" href="manifest.json">
        <meta name="theme-color" content="#1976d2">
      </head>
      <body>
        <nd-root></nd-root>
        <noscript>Please enable JavaScript to continue using this application.</noscript>
      </body>
      </html>
    `;
    const document = (cy as any).state('document');
    document.write(html);
    document.close();

    cy.get('nd-root').then(el$ => {
      platformBrowserDynamic()
        .bootstrapModule(AppModule)
        .then(function (moduleRef) {
          moduleRef.instance.app.bootstrap(AppComponent, el$.get(0));
        });
    });
  });

  it('works', () => {
    cy.contains('ngx-domoboard').should('be.visible');
  });

  it('works again', () => {
    cy.contains('ngx-domoboard').should('be.visible');
  });
});
