import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subject, concat } from 'rxjs';
import { tap, takeUntil, take } from 'rxjs/operators';

import { Switch } from '@nd/core/models';

import { SwitchesService } from '@nd/core/services';

@Component({
  selector: 'nd-switches',
  templateUrl: './switches.component.html',
  styleUrls: ['./switches.component.scss']
})
export class SwitchesComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject();

  switches$ = this.service.select<Switch[]>('switches');

  switchTypes$ = this.service.select<string[]>('switchTypes');

  icon = {
    Fireplace: 'nd-fireplace',
    Light: 'nb-lightbulb',
    Door: 'nd-door'
  };

  constructor(private service: SwitchesService) { }

  ngOnInit() {
    concat(
      this.service.getSwitches(),
      this.service.refreshSwitches()
    ).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe();
  }

  statusChanged(event: any, light: Switch) {
    if (['On/Off', 'Dimmer'].includes(light.SwitchType)) {
      this.service.switchLight(light.idx, event).pipe(
        tap(resp => {
          if (resp.status === 'OK') {
            light.Status = event;
          } else {
            throw resp;
          }
        }),
        take(1),
        takeUntil(this.unsubscribe$)
      ).subscribe();
    } else {
      throw new Error('Not a switchable device!');
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
