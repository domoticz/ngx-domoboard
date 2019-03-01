import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';
import { map, distinctUntilChanged, pluck, tap } from 'rxjs/operators';

import { DomoticzResponse, LightSwitch } from '@nd/core/models';

import { Urls } from '@nd/core/enums/urls.enum';

import { DataService } from './data.service';

interface State {
  lightSwitches: LightSwitch[];
}

const initState = {
  lightSwitches: []
};

@Injectable({providedIn: 'root'})
export class DomoticzService extends DataService {

  private subject = new BehaviorSubject<State>(initState);
  store = this.subject.asObservable().pipe(distinctUntilChanged());

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  select<T>(...name: string[]): Observable<T> {
    return this.store.pipe(pluck(...name));
  }

  getLightSwitches(): Observable<LightSwitch[]> {
    return this.get<DomoticzResponse>(Urls.lightswitches).pipe(
        map((resp: DomoticzResponse) => resp.result),
        tap((switches: LightSwitch[]) => this.subject.next(
          { ...this.subject.value, lightSwitches: switches }
        ))
      );
  }

}
