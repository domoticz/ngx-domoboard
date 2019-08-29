import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, tap, pluck, map } from 'rxjs/operators';

import { DataService } from './data.service';
import { DBService } from './db.service';

import { DomoticzResponse, Switch, Temp, DomoticzColor } from '@nd/core/models';
import { Api } from '@nd/core/enums/api.enum';
import { environment } from 'environments/environment';

interface State<T> {
  device: T;
  isSubscribed: boolean;
}

const pushApi = {
  server: environment.pushServer,
  monitor: '/monitor-device',
  stop: '/stop-monitoring',
  isMonitoring: '/is-monitoring'
};

@Injectable({providedIn: 'root'})
export class DeviceOptionsService extends DataService {

  initialState: State<Temp | Switch> = {
    device: {} as Temp | Switch,
    isSubscribed: false
  };

  private subject = new BehaviorSubject<State<Temp | Switch>>(this.initialState);
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

  getDevice<T>(idx: string): Observable<DomoticzResponse<T>> {
    return this.get<DomoticzResponse<T>>(Api.device.replace('{idx}', idx)).pipe(
      tap((resp: DomoticzResponse<T>) => !!resp ? this.subject.next({
        ...this.subject.value, device: resp.result[0] as any
      }) : this.clearStore())
    );
  }

  renameDevice(idx: string, name: string): Observable<DomoticzResponse<any>> {
    return this.get<DomoticzResponse<any>>(Api.renameDevice.replace('{idx}', idx).replace('{name}', name));
  }

  setDimLevel(idx: string, level: number): Observable<DomoticzResponse<any>> {
    return this.get<DomoticzResponse<any>>(Api.dimLevel.replace('{idx}', idx).replace('{level}', level.toString()));
  }

  setColorBrightness(idx: string, color: DomoticzColor): Observable<DomoticzResponse<any>> {
    return this.get<DomoticzResponse<any>>(
      Api.colorBrightness.replace('{idx}', idx).replace('{color}', JSON.stringify(color))
    );
  }

  setKelvinLevel(idx: string, kelvin: string): Observable<DomoticzResponse<any>> {
    return this.get<DomoticzResponse<any>>(
      Api.kelvinLevel.replace('{idx}', idx).replace('{kelvin}', kelvin)
    );
  }

  isSubscribed(idx: string, pushEndpoint: string): Observable<any> {
    return this.httpClient.post<boolean>(`${pushApi.server}${pushApi.isMonitoring}`,
      {
        idx: idx,
        pushEndpoint: pushEndpoint
      }
    ).pipe(
      tap((resp: any) => {
        if (resp.status === 'OK') {
          this.syncIsSubscribed(resp.isMonitoring);
        }
      })
    );
  }

  subscribeToNotifications(payload: any): Observable<any> {
    return this.httpClient.post(`${pushApi.server}${pushApi.monitor}`, payload).pipe(
      tap((resp: any) => {
        if (resp.status === 'OK') {
          this.syncIsSubscribed(true);
        }
      })
    );
  }

  stopSubscription(idx: string, pushEndpoint: string): Observable<any> {
    return this.httpClient.post<boolean>(`${pushApi.server}${pushApi.stop}`, {
      idx: idx,
      pushEndpoint: pushEndpoint
    }).pipe(
      tap((resp: any) => {
        if (resp.status === 'OK') {
          this.syncIsSubscribed(false);
        }
      })
    );
  }

  syncIsSubscribed(isSubscribed: boolean) {
    this.subject.next({
      ...this.subject.value, isSubscribed: isSubscribed
    });
  }

  clearStore() {
    this.subject.next(this.initialState);
  }

}
