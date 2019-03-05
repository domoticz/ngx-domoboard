import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';
import { map, distinctUntilChanged, pluck, tap, filter } from 'rxjs/operators';

import { DomoticzResponse, Light } from '@nd/core/models';

import { Urls } from '@nd/core/enums/urls.enum';

import { DataService } from './data.service';

interface State {
  lights: Light[];
}

@Injectable({providedIn: 'root'})
export class DomoticzService extends DataService {

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
        tap((devices: Light[]) => this.subject.next(
          { ...this.subject.value, lights: devices }
        ))
      );
  }

  switchLight(idx, cmd): Observable<DomoticzResponse> {
    return this.get<DomoticzResponse>(
      Urls.switchLight.replace('{idx}', idx).replace('{switchcmd}', cmd)
    );
  }

}
