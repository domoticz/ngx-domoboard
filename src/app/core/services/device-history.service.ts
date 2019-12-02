import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, tap, pluck } from 'rxjs/operators';

import { DataService } from './data.service';
import { DBService } from './db.service';

import { DomoticzResponse, TempGraphData, SwitchLog } from '@nd/core/models';
import { Api } from '@nd/core/enums/api.enum';

interface State {
  tempGraph: {
    day: TempGraphData[];
    month: TempGraphData[];
    year: TempGraphData[];
  };
  switchLogs: SwitchLog[];
}

@Injectable({ providedIn: 'root' })
export class DeviceHistoryService extends DataService {
  initialState: State = {
    tempGraph: {
      day: [],
      month: [],
      year: []
    },
    switchLogs: []
  };

  private subject = new BehaviorSubject<State>(this.initialState);
  store = this.subject
    .asObservable()
    .pipe(
      distinctUntilChanged((x, y) => JSON.stringify(x) === JSON.stringify(y))
    );

  constructor(httpClient: HttpClient, dbService: DBService) {
    super(httpClient, dbService);
  }

  select<T>(...name: string[]): Observable<T> {
    return this.store.pipe(pluck(...name));
  }

  getTempGraph(idx: string, range: string): Observable<DomoticzResponse<any>> {
    return this.get<DomoticzResponse<any>>(
      Api.tempGraph.replace('{idx}', idx).replace('{range}', range)
    ).pipe(
      tap((resp: DomoticzResponse<any>) => {
        if (resp.status === 'OK') {
          this.subject.next({
            ...this.subject.value,
            tempGraph: {
              ...this.subject.value.tempGraph,
              [range]: resp.result
            }
          });
        }
      })
    );
  }

  getSwitchLogs(idx: string): Observable<DomoticzResponse<SwitchLog>> {
    return this.get<DomoticzResponse<SwitchLog>>(
      Api.lightLog.replace('{idx}', idx)
    ).pipe(
      tap((resp: DomoticzResponse<SwitchLog>) => {
        if (resp.status === 'OK') {
          this.subject.next({
            ...this.subject.value,
            switchLogs: resp.result
          });
        }
      })
    );
  }

  clearStore() {
    this.subject.next(this.initialState);
  }
}
