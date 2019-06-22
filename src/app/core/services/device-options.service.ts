import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, tap, pluck, filter } from 'rxjs/operators';

import { DataService } from './data.service';
import { DBService } from './db.service';

import { DomoticzResponse, Switch, Temp } from '@nd/core/models';
import { Api } from '@nd/core/enums/api.enum';

const isDevice = (device: any): device is Switch | Temp => device.idx !== undefined;

interface State<T> {
  device: T;
}

@Injectable({providedIn: 'root'})
export class DeviceOptionsService<T> extends DataService {

  initialState: State<T> = {
    device: {} as T
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

  getDevice(idx: string): Observable<DomoticzResponse<T>> {
    return this.get<DomoticzResponse<T>>(Api.device.replace('{idx}', idx)).pipe(
      filter(() => {
        const device = this.subject.value.device;
        return isDevice(device) ? device.idx !== idx : !!device ? true : false;
      }),
      tap((resp: DomoticzResponse<T>) => !!resp ? this.subject.next({
        ...this.subject.value, device: resp.result[0]
      }) : this.clearStore())
    );
  }

  clearStore() {
    this.subject.next(this.initialState);
  }

}
