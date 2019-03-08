import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject, interval } from 'rxjs';
import { map, distinctUntilChanged, pluck, tap, switchMap, filter } from 'rxjs/operators';

import { DomoticzResponse, Light } from '@nd/core/models';

import { Urls } from '@nd/core/enums/urls.enum';

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

  getLights(): Observable<Light[]> {
    return this.get<DomoticzResponse>(Urls.lights).pipe(
        map((resp: DomoticzResponse) => resp.result),
        tap((devices: Light[]) =>
          this.subject.next({ ...this.subject.value, lights: devices, lastUpdate: new Date().toString() }))
    );
  }

  switchLight(idx, cmd): Observable<DomoticzResponse> {
    return this.get<DomoticzResponse>(
      Urls.switchLight.replace('{idx}', idx).replace('{switchcmd}', cmd)
    );
  }

  refreshLights(): Observable<DomoticzResponse> {
    return interval(10000).pipe(
      switchMap(() =>
        this.get<DomoticzResponse>(Urls.refreshLights.replace('{lastupdate}', this.subject.value.lastUpdate))),
      filter(resp => !!resp.result),
      tap(resp => this.subject.next({ ...this.subject.value, lights:
        this.subject.value.lights.map(light => resp.result.find(res => light.idx === res.idx) || light),
        lastUpdate: resp.ActTime.toString() })
      )
    );
  }

  clearStore() {
    this.subject.next({} as State);
  }

}
