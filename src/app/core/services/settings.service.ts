import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { DataService } from './data.service';

import { Urls } from '@nd/core/enums/urls.enum';

@Injectable({providedIn: 'root'})
export class SettingsService {

  constructor(private httpClient: HttpClient) { }

  getStatus(ip: string, port: number): Observable<any> {
    return this.httpClient.get(`http://${ip}:${port}/${Urls.status}`);
  }

}
