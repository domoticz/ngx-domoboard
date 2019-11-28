import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject, merge, of } from 'rxjs';
import { distinctUntilChanged, tap, pluck } from 'rxjs/operators';

import { DataService } from './data.service';
import { DBService } from './db.service';

import {
  DomoticzResponse,
  Switch,
  Temp,
  DomoticzColor,
  TempGraphData
} from '@nd/core/models';
import { Api } from '@nd/core/enums/api.enum';

import { environment } from 'environments/environment';
import { SwitchLog } from '../models/switch-log.interface';

interface State<T> {
  device: T;
  isSubscribed: boolean;
  tempGraph: {
    day: TempGraphData[];
    month: TempGraphData[];
    year: TempGraphData[];
  };
  switchLogs: SwitchLog[];
}

const pushApi = {
  server: environment.pushServer,
  monitor: '/monitor-device',
  stop: '/stop-monitoring',
  isMonitoring: '/is-monitoring'
};

const isTemp = (device: any): device is Temp => device.Temp !== undefined;

@Injectable({ providedIn: 'root' })
export class DeviceOptionsService extends DataService {
  initialState: State<Temp | Switch> = {
    device: {} as Temp | Switch,
    isSubscribed: false,
    tempGraph: {
      day: [],
      month: [],
      year: []
    },
    switchLogs: []
  };

  private subject = new BehaviorSubject<State<Temp | Switch>>(
    this.initialState
  );
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

  getDevice<T>(idx: string): Observable<DomoticzResponse<T>> {
    return this.get<DomoticzResponse<T>>(Api.device.replace('{idx}', idx)).pipe(
      tap((resp: DomoticzResponse<T>) =>
        !!resp
          ? this.subject.next({
              ...this.subject.value,
              device: resp.result[0] as any
            })
          : this.clearStore()
      )
    );
  }

  renameDevice(idx: string, name: string): Observable<DomoticzResponse<any>> {
    return this.get<DomoticzResponse<any>>(
      Api.renameDevice.replace('{idx}', idx).replace('{name}', name)
    );
  }

  setDimLevel(idx: string, level: number): Observable<DomoticzResponse<any>> {
    return this.get<DomoticzResponse<any>>(
      Api.dimLevel.replace('{idx}', idx).replace('{level}', level.toString())
    );
  }

  setColorBrightness(
    idx: string,
    color: DomoticzColor
  ): Observable<DomoticzResponse<any>> {
    return this.get<DomoticzResponse<any>>(
      Api.colorBrightness
        .replace('{idx}', idx)
        .replace('{color}', JSON.stringify(color))
    );
  }

  setKelvinLevel(
    idx: string,
    kelvin: string
  ): Observable<DomoticzResponse<any>> {
    return this.get<DomoticzResponse<any>>(
      Api.kelvinLevel.replace('{idx}', idx).replace('{kelvin}', kelvin)
    );
  }

  getTempGraph(range: string): Observable<DomoticzResponse<Temp>> {
    return this.get<DomoticzResponse<Temp>>(
      Api.tempGraph
        .replace('{idx}', this.subject.value.device.idx)
        .replace('{range}', range)
    ).pipe(
      tap((resp: DomoticzResponse<Temp>) => {
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

  getSwitchLogs(): Observable<DomoticzResponse<SwitchLog>> {
    return this.get<DomoticzResponse<SwitchLog>>(
      Api.lightLog.replace('{idx}', this.subject.value.device.idx)
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

  isSubscribed(idx: string, pushEndpoint: string): Observable<any> {
    return this.httpClient
      .post<boolean>(`${pushApi.server}${pushApi.isMonitoring}`, {
        idx: idx,
        pushEndpoint: pushEndpoint
      })
      .pipe(
        tap((resp: any) => {
          if (resp.status === 'OK') {
            this.syncIsSubscribed(resp.isMonitoring);
          }
        })
      );
  }

  subscribeToNotifications(payload: any): Observable<any> {
    return this.httpClient
      .post(`${pushApi.server}${pushApi.monitor}`, payload)
      .pipe(
        tap((resp: any) => {
          if (resp.status === 'OK') {
            this.syncIsSubscribed(true);
          }
        })
      );
  }

  stopSubscription(idx: string, pushEndpoint: string): Observable<any> {
    return this.httpClient
      .post<boolean>(`${pushApi.server}${pushApi.stop}`, {
        idx: idx,
        pushEndpoint: pushEndpoint
      })
      .pipe(
        tap((resp: any) => {
          if (resp.status === 'OK') {
            this.syncIsSubscribed(false);
          }
        })
      );
  }

  syncIsSubscribed(isSubscribed: boolean) {
    this.subject.next({
      ...this.subject.value,
      isSubscribed: isSubscribed
    });
  }

  syncColor(color: DomoticzColor) {
    this.subject.next({
      ...this.subject.value,
      device: {
        ...this.subject.value.device,
        Color: JSON.stringify(color)
      }
    });
  }

  clearStore() {
    this.subject.next(this.initialState);
  }
}
