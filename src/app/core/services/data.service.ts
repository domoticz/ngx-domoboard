import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { DomoticzSettings } from '@nd/core/models';

import { DBService } from './db.service';

@Injectable({providedIn: 'root'})
export abstract class DataService {

  constructor(
    private httpClient: HttpClient,
    private dbService: DBService
  ) { }

  protected get<T>(relativeUrl: string) {
    return this.dbService.store.pipe(
      switchMap(settings => !!settings ? this.httpClient.get<T>(
        `${settings.ssl ? 'https' : 'http'}://${settings.ip}:${settings.port}/${ relativeUrl }`,
        !!settings.username && !!settings.password ? this.getAuthOption(settings) : {}
      ) : of(null))
    );
  }

  protected post<T>(relativeUrl: string, data: any) {
    return this.dbService.store.pipe(
      switchMap(settings => !!settings ? this.httpClient.post<T>(
      `${settings.ssl ? 'https' : 'http'}://${settings.ip}:${settings.port}/${ relativeUrl }`,
      data
      ) : of(null))
    );
  }

  getAuthOption(settings: DomoticzSettings): any {
    const authToken = btoa(`${settings.username}:${settings.password}`);
    return {
      headers: new HttpHeaders({
        'Authorization': `Basic: ${authToken}`
      })
    };
  }

}
