import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, tap, pluck } from 'rxjs/operators';

import { DataService } from './data.service';
import { DBService } from './db.service';

import { DomoticzResponse, TempGraphData, HumGraphData, SwitchLog } from '@nd/core/models';
import { Api } from '@nd/core/enums/api.enum';

interface State {
  tempGraph: {
    day: TempGraphData[];
    month: TempGraphData[];
    year: TempGraphData[];
  };
  humGraph: {
    day: HumGraphData[];
    month: HumGraphData[];
    year: HumGraphData[];
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
    humGraph: {
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
    let cmds: string;
    cmds = Api.tempGraph.replace('{idx}', idx).replace('{range}', range);
    console.log("👣 get temp graph request from logs-->" + cmds);

    return this.get<DomoticzResponse<any>>(
      Api.tempGraph.replace('{idx}', idx).replace('{range}', range)
    ).pipe(
      tap((resp: DomoticzResponse<any>) => {
        console.log("↩️ Response from Server when get temp graph from logs-->" + JSON.stringify(resp, null, 4));
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

  getHumGraph(idx: string, range: string): Observable<DomoticzResponse<any>> {
    let cmds: string;
    cmds = Api.humGraph.replace('{idx}', idx).replace('{range}', range);
    console.log("👣 get humidity graph request from logs-->" + cmds);

    return this.get<DomoticzResponse<any>>(
      Api.humGraph.replace('{idx}', idx).replace('{range}', range)
    ).pipe(
      tap((resp: DomoticzResponse<any>) => {
        console.log("↩️ Response from Server when get humidity graph from logs-->" + JSON.stringify(resp, null, 4));
        if (resp.status === 'OK') {
          this.subject.next({
            ...this.subject.value,
            humGraph: {
              ...this.subject.value.humGraph,
              [range]: resp.result
            }
          });
        }
      })
    );
  }

  getSwitchLogs(idx: string): Observable<DomoticzResponse<SwitchLog>> {
    let cmds: string;
    cmds = Api.lightLog.replace('{idx}', idx);
    console.log("👣 get switch logs request from logs-->" + cmds);

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

  clearSwitchLogs(idx: string): Observable<DomoticzResponse<any>> {
    let cmds: string;
    cmds = Api.clearLog.replace('{idx}', idx);
    console.log("👣 clear switch logs request from logs-->" + cmds);

    return this.get<DomoticzResponse<any>>(
      Api.clearLog.replace('{idx}', idx)
    ).pipe(
      tap((resp: DomoticzResponse<any>) => {
        if (resp.status === 'OK') {
          this.subject.next({
            ...this.subject.value,
            switchLogs: []
          });
        }
      })
    );
  }

  clearStore() {
    this.subject.next(this.initialState);
  }
}
