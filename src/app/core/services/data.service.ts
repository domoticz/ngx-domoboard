import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { of, BehaviorSubject } from 'rxjs';
import { switchMap, distinctUntilChanged, tap } from 'rxjs/operators';

import { DomoticzSettings } from '@nd/core/models';

import { DBService } from './db.service';

@Injectable({providedIn: 'root'})
export abstract class DataService {

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable().pipe(distinctUntilChanged());

  settings$ = this.dbService.select<DomoticzSettings>('settings');

  constructor(
    protected httpClient: HttpClient,
    protected dbService: DBService
  ) { }

  protected get<T>(relativeUrl: string, spinner?: boolean) {
    return this.settings$.pipe(
      switchMap(settings => {
        if (!!settings) {
          if (spinner) {
            this.loadingSubject.next(true);
          }
          return this.httpClient.get<T>(
            `${settings.ssl ? 'https' : 'http'}://${settings.domain}:${settings.port}/${ relativeUrl }`,
            !!settings.credentials ? this.getAuthOption(settings) : {}
            ).pipe(
              tap(() => this.loadingSubject.next(false))
            );
        } else {
          return of(null);
        }
      })
    );
  }

  protected post<T>(relativeUrl: string, data: any) {
    return this.settings$.pipe(
      switchMap(settings => !!settings ? this.httpClient.post<T>(
      `${settings.ssl ? 'https' : 'http'}://${settings.domain}:${settings.port}/${ relativeUrl }`,
      data
      ) : of(null))
    );
  }

  getAuthOption(settings: DomoticzSettings): any {
    const authToken = btoa(`${settings.credentials.username}:${settings.credentials.password}`);
    return {
      headers: new HttpHeaders({
        'Authorization': `Basic: ${authToken}`
      })
    };
  }

}
