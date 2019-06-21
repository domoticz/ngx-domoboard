import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { DataService } from './data.service';
import { DBService } from './db.service';

import { DomoticzResponse } from '@nd/core/models';
import { Api } from '@nd/core/enums/api.enum';

@Injectable({providedIn: 'root'})
export class DeviceOptionsService extends DataService {

  constructor(
    httpClient: HttpClient,
    dbService: DBService
  ) {
    super(httpClient, dbService);
  }

  getDevice(idx: string): Observable<DomoticzResponse<any>> {
    return this.get<DomoticzResponse<any>>(Api.device.replace('{idx}', idx));
  }

}
