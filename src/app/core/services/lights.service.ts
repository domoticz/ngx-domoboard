import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject, interval } from 'rxjs';
import { distinctUntilChanged, pluck, tap, switchMap, filter, shareReplay, map } from 'rxjs/operators';

import { DomoticzResponse, Light } from '@nd/core/models';

import { Api } from '@nd/core/enums/api.enum';

import { DBService } from './db.service';
import { DataService } from './data.service';

interface State {
  lights: Light[];
  lastUpdate: string;
}

const initialState: State = {
  lights: [],
  lastUpdate: ''
};

@Injectable({providedIn: 'root'})
export class LightsService extends DataService {

  private subject = new BehaviorSubject<State>(initialState);
  store = this.subject.asObservable().pipe(
    distinctUntilChanged((x, y) => JSON.stringify(x) === JSON.stringify(y))
  );

  constructor(
    httpClient: HttpClient,
    dbService: DBService
  ) {
    super(httpClient, dbService);
  }

  select<T>(...name: string[]): Observable<T> {
    return this.store.pipe(pluck(...name));
  }

  getLights(): Observable<DomoticzResponse> {
    return this.get<DomoticzResponse>(Api.lights).pipe(
      tap((resp: DomoticzResponse) =>
        !!resp ? this.subject.next({
          ...this.subject.value, lights: resp.result, lastUpdate: resp.ActTime.toString()
          }) : this.clearStore()
      )
    );
  }

  switchLight(idx: string, cmd: string): Observable<DomoticzResponse> {
    return this.get<DomoticzResponse>(
      Api.switchLight.replace('{idx}', idx).replace('{switchcmd}', cmd)
    );
  }

  refreshLights(): Observable<DomoticzResponse> {
    return interval(10000).pipe(
      switchMap(() =>
        this.get<DomoticzResponse>(Api.refreshLights.replace('{lastupdate}', this.subject.value.lastUpdate))),
      filter(resp => !!resp && !!resp.result),
      tap(resp => this.subject.next({
        ...this.subject.value, lights: this.subject.value.lights.map(light =>
          resp.result.find(res => light.idx === res.idx) || light), lastUpdate: resp.ActTime.toString()
      }))
    );
  }

  clearStore() {
    this.subject.next(initialState);
  }

}
