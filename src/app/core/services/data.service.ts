import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DBService } from './db.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({providedIn: 'root'})
export abstract class DataService {

  constructor(
    private httpClient: HttpClient,
    private dbService: DBService
  ) { }

  protected get<T>(relativeUrl: string) {
    return this.dbService.store.pipe(
      switchMap(baseUrl => !!baseUrl ? this.httpClient.get<T>(
        `${baseUrl.ssl ? 'https' : 'http'}://${baseUrl.ip}:${baseUrl.port}/${ relativeUrl }`
      ) : of(null))
    );
  }

  protected post<T>(relativeUrl: string, data: any) {
    return this.dbService.store.pipe(
      switchMap(baseUrl => !!baseUrl ? this.httpClient.post<T>(
      `${baseUrl.ssl ? 'https' : 'http'}://${baseUrl.ip}:${baseUrl.port}/${ relativeUrl }`,
      data
      ) : of(null))
    );
  }

}
