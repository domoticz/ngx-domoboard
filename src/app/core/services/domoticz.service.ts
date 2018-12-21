import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from './data.service';
import { Observable } from 'rxjs';
import { LightSwitch } from '../models/lightSwitch.interface';
import { Urls } from '../enums/urls.enum';

@Injectable({providedIn: 'root'})
export class DomoticzService extends DataService {

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getLightSwitches(): Observable<LightSwitch[]> {
    return this.get<LightSwitch[]>(Urls.getlightswitches);
  }

}
