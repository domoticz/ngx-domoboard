import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { DBService } from '../services';
import { DomoticzSettings } from '../models';

@Injectable({providedIn: 'root'})
export class AuthInterceptor implements HttpInterceptor {

  settings$ = this.dbService.select<DomoticzSettings>('settings');

  constructor(private dbService: DBService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.settings$.pipe(
      map(settings => {
        try {
          if (!!Object.keys(settings.credentials).every(key => settings.credentials[key] !== null)) {
            const authToken = btoa(`${settings.credentials.username}:${settings.credentials.password}`);
            req = req.clone({
              headers: req.headers.set('Authorization', `Basic ${authToken}`)
            });
          }
        } catch (e) { }
        return req;
      }),
      switchMap(_req => next.handle(_req))
    );
  }
}
