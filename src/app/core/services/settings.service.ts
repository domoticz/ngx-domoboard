import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { DataService } from './data.service';

import { Urls } from '@nd/core/enums/urls.enum';

@Injectable({providedIn: 'root'})
export class SettingsService extends DataService {

  getStatus(): Observable<any> {
    return this.get(Urls.status);
  }

}
