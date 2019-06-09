import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { DBService } from '../services';

@Injectable({providedIn: 'root'})
export class AuthInterceptor implements HttpInterceptor {

  constructor(private dbService: DBService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.dbService.store.pipe(
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
