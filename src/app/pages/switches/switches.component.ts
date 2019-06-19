import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subject, merge } from 'rxjs';
import { tap, takeUntil, take, finalize } from 'rxjs/operators';

import { Switch } from '@nd/core/models';

import { DevicesService, SwitchesService } from '@nd/core/services';

@Component({
  selector: 'nd-switches',
  templateUrl: './switches.component.html',
  styleUrls: ['./switches.component.scss']
})
export class SwitchesComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject();

  switches$ = this.devicesService.select<Switch[]>('devices');

  switchTypes$ = this.devicesService.select<string[]>('types');

  icon = {
    Fireplace: 'nd-fireplace',
    Light: 'nb-lightbulb',
    Door: 'nd-door'
  };

  loading$ = this.devicesService.loading$;

  switchLoading: boolean;

  clickedIdx: string;

  constructor(
    private devicesService: DevicesService<Switch>,
    private switchesService: SwitchesService
  ) { }

  ngOnInit() {
    merge(
      this.devicesService.getDevices('light'),
      this.devicesService.refreshDevices('light')
    ).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe();
  }

  statusChanged(event: any, _switch: Switch) {
    if (['On/Off', 'Dimmer'].includes(_switch.SwitchType)) {
      this.switchLoading = true;
      this.clickedIdx = _switch.idx;
      this.switchesService.switchLight(_switch.idx, event).pipe(
        tap(resp => {
          if (resp.status === 'OK') {
            _switch.Status = event;
          } else {
            throw resp;
          }
        }),
        take(1),
        finalize(() => this.switchLoading = false),
        takeUntil(this.unsubscribe$)
      ).subscribe();
    } else {
      throw new Error('Not a switchable device!');
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
