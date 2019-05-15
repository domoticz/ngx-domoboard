/// <reference types="cypress" />

import 'core-js/es7/reflect';

import { ApplicationRef, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_BASE_HREF } from '@angular/common';

import { NbThemeModule, NbLayoutModule, NbAlertModule } from '@nebular/theme';

import { SharedModule } from '../../src/app/shared/shared.module';

import 'zone.js';
import { AppComponent } from '../../src/app/app.component';

import { routes } from '../../src/app/app.routes';

// dynamic loading based on blog post
// https://blog.angularindepth.com/how-to-manually-bootstrap-an-angular-application-9a36ccf86429

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: 'cosmic' }),
    NbLayoutModule,
    SharedModule,
    NbAlertModule,
  ],
  providers: [{ provide: APP_BASE_HREF, useValue: '/ngx-domoboard/' }],
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
      <head>
        <meta charset="UTF-8">
      </head>
      <body>
        <app-root></app-root>
      </body>
    `;
    const document = (cy as any).state('document');
    document.write(html);
    document.close();

    cy.get('app-root').then(el$ => {
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
