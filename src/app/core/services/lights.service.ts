import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject, interval } from 'rxjs';
import { distinctUntilChanged, pluck, tap, switchMap, filter } from 'rxjs/operators';

import { DomoticzResponse, Light } from '@nd/core/models';

import { Api } from '@nd/core/enums/api.enum';

import { DataService } from './data.service';

interface State {
  lights: Light[];
  lastUpdate: string;
}

@Injectable({providedIn: 'root'})
export class LightsService extends DataService {

  private subject = new BehaviorSubject<State>({} as State);
  store = this.subject.asObservable().pipe(distinctUntilChanged());

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  select<T>(...name: string[]): Observable<T> {
    return this.store.pipe(pluck(...name));
  }

  getLights(): Observable<DomoticzResponse> {
    return this.get(Api.lights).pipe(
      tap((resp: DomoticzResponse) =>
        this.subject.next({ ...this.subject.value, lights: resp.result, lastUpdate: resp.ActTime.toString() }))
    );
  }

  switchLight(idx, cmd): Observable<DomoticzResponse> {
    return this.get(
      Api.switchLight.replace('{idx}', idx).replace('{switchcmd}', cmd)
    );
  }

  // refreshLights(): Observable<DomoticzResponse> {
  //   return interval(10000).pipe(
  //     switchMap(() =>
  //       this.get<DomoticzResponse>(Api.refreshLights.replace('{lastupdate}', this.subject.value.lastUpdate))),
  //     filter(resp => !!resp.result),
  //     tap(resp => this.subject.next({ ...this.subject.value, lights:
  //       this.subject.value.lights.map(light => resp.result.find(res => light.idx === res.idx) || light),
  //       lastUpdate: resp.ActTime.toString() })
  //     )
  //   );
  // }

  clearStore() {
    this.subject.next({} as State);
  }

}
