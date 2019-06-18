import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, pluck, tap } from 'rxjs/operators';

import { DataService } from './data.service';
import { DBService } from './db.service';

import { DomoticzResponse, Switch, Temp } from '@nd/core/models';
import { Api } from '@nd/core/enums/api.enum';

const isSwitch = (device: any): device is Switch => device.SwitchType !== undefined;
const isTemp = (device: any): device is Temp =>
  device.Temp !== undefined || device.Humidity !== undefined;

interface State<T> {
  types: string[];
  devices: T[];
  lastUpdate: string;
}

@Injectable({providedIn: 'root'})
export class DevicesService<T> extends DataService {

  initialState: State<T> = {
    types: [],
    devices: [],
    lastUpdate: ''
  };

  private subject = new BehaviorSubject<State<T>>(this.initialState);
  store = this.subject.asObservable().pipe(
    distinctUntilChanged((x, y) => JSON.stringify(x) === JSON.stringify(y))
  );

  constructor(
    httpClient: HttpClient,
    dbService: DBService
  ) {
    super(httpClient, dbService);
  }

  select<T1>(...name: string[]): Observable<T1> {
    return this.store.pipe(pluck(...name));
  }

  getDevices(filter: string): Observable<DomoticzResponse<T>> {
    return this.get<DomoticzResponse<T>>(Api.devices.replace('{filter}', filter), true).pipe(
      tap((resp: DomoticzResponse<T>) =>
        !!resp ? this.subject.next({
          ...this.subject.value, devices: resp.result, lastUpdate: resp.ActTime.toString(),
          types: [...resp.result.map(d => {
            if (isSwitch(d)) {
              return d.SwitchType;
            } else if (isTemp(d)) {
              return d.Type;
            }
          }).filter((type, i, types) => types.indexOf(type) === i)]
          }) : this.clearStore()
      )
    );
  }

  clearStore() {
    this.subject.next(this.initialState);
  }

}
