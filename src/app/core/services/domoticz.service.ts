import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from './data.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LightSwitch } from '../models/light-switch.interface';
import { DomoticzResponse } from '../models/domoticz-response.interface';
import { Urls } from '../enums/urls.enum';

@Injectable({providedIn: 'root'})
export class DomoticzService extends DataService {

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getLightSwitches(): Observable<LightSwitch[]> {
    return this.get<DomoticzResponse>(Urls.getlightswitches)
      .pipe(map((resp: DomoticzResponse) => resp.result));
  }

}
