import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Urls } from '@nd/core/enums/urls.enum';
import { DomoticzStatus } from '@nd/core/models/domoticz-status.interface';

@Injectable({providedIn: 'root'})
export class SettingsService {

  constructor(private httpClient: HttpClient) { }

  getStatus(ssl: boolean, ip: string, port: number): Observable<DomoticzStatus> {
    return this.httpClient.get<DomoticzStatus>(`${ssl ? 'https' : 'http'}://${ip}:${port}/${Urls.status}`);
  }

}
