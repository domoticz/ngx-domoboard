import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, timer } from 'rxjs';
import { take, mergeMap } from 'rxjs/operators';
import { DevicesService } from '../services';

@Injectable({ providedIn: 'root' })
export class DevicesResolver implements Resolve<Observable<any>> {
  constructor(private service: DevicesService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    let filter;
    if (route.url[0].path === 'temperature') {
      filter = 'temp';
    } else if (route.url[0].path === 'switches') {
      filter = 'light';
    }
    return timer(300).pipe(
      mergeMap(() => this.service.getDevices(filter)),
      take(1)
    );
  }
}
