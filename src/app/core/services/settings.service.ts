import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Api } from '@nd/core/enums/api.enum';
import { DomoticzStatus, BaseUrl } from '@nd/core/models';

@Injectable({providedIn: 'root'})
export class SettingsService {

  constructor(private httpClient: HttpClient) { }

  getStatus(url: BaseUrl): Observable<DomoticzStatus> {
    return this.httpClient.get<DomoticzStatus>(
      `${url.ssl ? 'https' : 'http'}://${url.ip}:${url.port}/${Api.status}`
    );
  }

}
