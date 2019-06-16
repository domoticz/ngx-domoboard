import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject, interval } from 'rxjs';
import { distinctUntilChanged, pluck, tap, switchMap, filter } from 'rxjs/operators';

import { DomoticzResponse, Switch } from '@nd/core/models';

import { Api } from '@nd/core/enums/api.enum';

import { DBService } from './db.service';
import { DataService } from './data.service';

interface State {
  switchTypes: string[];
  switches: Switch[];
  lastUpdate: string;
}

const initialState: State = {
  switchTypes: [],
  switches: [],
  lastUpdate: ''
};

@Injectable({providedIn: 'root'})
export class SwitchesService extends DataService {

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

  getSwitches(): Observable<DomoticzResponse> {
    return this.get<DomoticzResponse>(Api.switches, true).pipe(
      tap((resp: DomoticzResponse) =>
        !!resp ? this.subject.next({
          ...this.subject.value, switches: resp.result, lastUpdate: resp.ActTime.toString(),
          switchTypes: [...resp.result.map(s => s.SwitchType).filter((st, i, sts) => sts.indexOf(st) === i)]
          }) : this.clearStore()
      )
    );
  }

  switchLight(idx: string, cmd: string): Observable<DomoticzResponse> {
    return this.get<DomoticzResponse>(
      Api.switchLight.replace('{idx}', idx).replace('{switchcmd}', cmd)
    );
  }

  refreshSwitches(): Observable<DomoticzResponse> {
    return interval(10000).pipe(
      switchMap(() =>
        this.get<DomoticzResponse>(Api.refreshSwitches.replace('{lastupdate}', this.subject.value.lastUpdate))),
      filter(resp => !!resp && !!resp.result),
      tap(resp => this.subject.next({
        ...this.subject.value, switches: this.subject.value.switches.map(light =>
          resp.result.find(res => light.idx === res.idx) || light), lastUpdate: resp.ActTime.toString()
      }))
    );
  }

  clearStore() {
    this.subject.next(initialState);
  }

}
