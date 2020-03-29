import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable, interval } from 'rxjs';
import {
  distinctUntilChanged,
  pluck,
  tap,
  switchMap,
  filter
} from 'rxjs/operators';

import { DataService } from './data.service';
import { DBService } from './db.service';

import { DomoticzResponse, Switch, Temp } from '@nd/core/models';
import { Api } from '@nd/core/enums/api.enum';

const isSwitch = (device: any): device is Switch => device.SwitchType !== undefined;
const isTemp = (device: any): device is Temp => device.Temp !== undefined || device.Humidity !== undefined;

interface State<T> {
  types: string[];
  devices: T[];
  lastUpdate: string;
}

@Injectable({ providedIn: 'root' })
export class DevicesService extends DataService {
  initialState: State<Switch | Temp> = {
    types: [],
    devices: [],
    lastUpdate: ''
  };

  private subject = new BehaviorSubject<State<Switch | Temp>>(
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
    return this.store.pipe(
      distinctUntilChanged((x, y) => JSON.stringify(x) === JSON.stringify(y)),
      pluck(...name)
    );
  }

  getDevices<T>(_filter: string): Observable<DomoticzResponse<T>> {
    let cmds: string;
    cmds = Api.devices.replace('{filter}', _filter);
    console.log("👣 get all devices request-->" + cmds);

    return this.get<DomoticzResponse<T>>(
      Api.devices.replace('{filter}', _filter), true).pipe(
        tap((resp: DomoticzResponse<T>) => {
          console.log("↩️ Response from Server when get all devices-->" + JSON.stringify(resp, null, 4));
          !!resp && !!resp.result ? this.subject.next({
            ...this.subject.value, devices: resp.result as any[], lastUpdate: resp.ActTime.toString(),
            types: [...resp.result.map(d => {
              if (isSwitch(d)) {
                return d.SwitchType;
              } else if (isTemp(d)) {
                return d.Type;
              }
            }).filter((type, i, types) => types.indexOf(type) === i)]
          }) : this.clearStore()
        }
        )
      );
  }

  refreshDevices<T>(_filter: string): Observable<DomoticzResponse<T>> {
    let cmds: string;
    cmds = Api.refreshDevices.replace('{lastupdate}', this.subject.value.lastUpdate).replace('{filter}', _filter);
    console.log("👣 refresh/update all devices request-->" + cmds);

    return interval(10000).pipe(
      switchMap(() =>
        this.get<DomoticzResponse<T>>(
          Api.refreshDevices
            .replace('{lastupdate}', this.subject.value.lastUpdate)
            .replace('{filter}', _filter)
        )
      ),
      filter(resp => !!resp && !!resp.result),
      tap(resp =>
        this.subject.next({
          ...this.subject.value,
          devices: this.subject.value.devices.map(
            device =>
              resp.result.find(res => {
                if (isSwitch(device) || isTemp(device)) {
                  return device.idx === res.idx;
                }
              }) || device),
          lastUpdate: resp.ActTime.toString()
        })
      )
    );
  }

  clearStore() {
    this.subject.next(this.initialState);
  }
}
