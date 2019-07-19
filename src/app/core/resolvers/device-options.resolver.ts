import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { Temp, Switch, DomoticzResponse } from '../models';
import { DeviceOptionsService } from '../services';

@Injectable({ providedIn: 'root' })
export class DeviceOptionsResolver implements Resolve<DomoticzResponse<Temp | Switch>> {

  constructor(private service: DeviceOptionsService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<DomoticzResponse<Temp | Switch>> {
    return this.service.getDevice<Temp | Switch>(route.paramMap.get('idx')).pipe(
      take(1)
    );
  }

}
