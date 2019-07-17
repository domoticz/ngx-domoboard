import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, timer } from 'rxjs';
import { take, concatMap } from 'rxjs/operators';

import { DomoticzResponse } from '../models';
import { DevicesService } from '../services';

@Injectable({ providedIn: 'root' })
export class DevicesResolver implements Resolve<Observable<DomoticzResponse<any>>> {

  constructor(private service: DevicesService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<DomoticzResponse<any>> {
    let filter: string;
    if (route.url[0].path === 'switches') {
      filter = 'light';
    } else if (route.url[0].path === 'temperature') {
      filter = 'temp';
    }

    return timer(300).pipe(
      concatMap(() => this.service.getDevices(filter)),
      take(1)
    );
  }

}
