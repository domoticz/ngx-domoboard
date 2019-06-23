import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { DomoticzResponse, Switch } from '@nd/core/models';

import { Api } from '@nd/core/enums/api.enum';

import { DBService } from './db.service';
import { DataService } from './data.service';

@Injectable({providedIn: 'root'})
export class SwitchesService extends DataService {

  constructor(
    httpClient: HttpClient,
    dbService: DBService
  ) {
    super(httpClient, dbService);
  }

  switchLight(idx: string, cmd: string): Observable<DomoticzResponse<any>> {
    return this.get<DomoticzResponse<any>>(
      Api.switchLight.replace('{idx}', idx).replace('{switchcmd}', cmd)
    );
  }

}
