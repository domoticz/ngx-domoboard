/// <reference types="cypress" />

// Required for JIT in NG-7
import 'core-js/es7/reflect';
import { NgModule, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { createCustomElement, NgElementConstructor } from '@angular/elements';

import 'zone.js';
import { AppComponent } from '@nd/app.component';
import { SharedModule } from '@nd/shared/shared.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SharedModule
  ],
  providers: [],
  entryComponents: [AppComponent]
})
class AppModule {

  appElement: NgElementConstructor<AppComponent>;

  constructor(private injector: Injector) { }

  ngDoBootstrap() {
    this.appElement = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define('nd-root', this.appElement);
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
          customElements.define('app-root', moduleRef.instance.appElement);
          // moduleRef.instance.app.bootstrap(AppComponent, el$.get(0));
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
