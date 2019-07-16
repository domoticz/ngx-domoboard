import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { tap, takeUntil, take, finalize } from 'rxjs/operators';

import { Switch, Temp } from '@nd/core/models';

import { DevicesService, SwitchesService } from '@nd/core/services';

@Component({
  selector: 'nd-switches',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject();

  switches$ = this.service.select<Switch[] | Temp[]>('devices');

  switchTypes$ = this.service.select<string[]>('types');

  icon = {
    Fireplace: 'nd-fireplace',
    Light: 'nb-lightbulb',
    Door: 'nd-door'
  };

  switchLoading: boolean;

  clickedIdx: string;

  constructor(
    private service: DevicesService,
    private switchesService: SwitchesService,
    private router: Router
  ) { }

  ngOnInit() {
    this.service.refreshDevices('light').pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe();
  }

  isSwitchOn(_switch: Switch): boolean {
    return !['Off', 'Closed'].some(s => _switch.Status.includes(s));
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

  onOptionsClick(idx: string) {
    this.router.navigate(['options', idx]);
  }

  ngOnDestroy() {
    this.service.clearStore();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
