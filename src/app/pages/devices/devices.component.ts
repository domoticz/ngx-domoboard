import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, NavigationStart, NavigationEnd } from '@angular/router';

import { Subject } from 'rxjs';
import { tap, takeUntil, take, finalize } from 'rxjs/operators';

import { Switch, Temp } from '@nd/core/models';

import { DevicesService, SwitchesService } from '@nd/core/services';

@Component({
  selector: 'nd-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject();

  devices$ = this.service.select<Switch[] | Temp[]>('devices');

  types$ = this.service.select<string[]>('types');

  icon = {
    Fireplace: 'nd-fireplace',
    Light: 'nb-lightbulb',
    Door: 'nd-door'
  };

  switchLoading: boolean;

  clickedIdx: string;

  path = this.route.snapshot.url[0].path;

  navState = 'in';

  loading: boolean;

  constructor(
    private service: DevicesService,
    private switchesService: SwitchesService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.service.refreshDevices('light').pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe();
    this.router.events.pipe(
      tap(event => {
        if (event instanceof NavigationStart) {
          this.navState = 'out';
          setTimeout(() => this.loading = true, 400);
        } else if (event instanceof NavigationEnd) {
          this.loading = true;
        }
      })
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
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
