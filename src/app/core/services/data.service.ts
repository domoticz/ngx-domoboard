import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

export abstract class DataService {

  protected baseUrl: string = environment.domoticzUrl;

  constructor(protected httpClient: HttpClient) {}

  protected get<T>(relativeUrl: string): Observable<T> {
    return this.httpClient.get<T>(`${ this.baseUrl }${ relativeUrl }`);
  }

  protected post<T>(relativeUrl: string, data: any): Observable<T> {
    return this.httpClient.post<T>(`${ this.baseUrl }${ relativeUrl }`, data);
  }

}
