import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subject, merge } from 'rxjs';
import { tap, takeUntil, take, finalize } from 'rxjs/operators';

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

  loading$ = this.service.loading$;

  switchLoading: boolean;

  clickedIdx: string;

  constructor(
    private service: SwitchesService
  ) { }

  ngOnInit() {
    merge(
      this.service.getSwitches(),
      this.service.refreshSwitches()
    ).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe();
  }

  statusChanged(event: any, _switch: Switch) {
    if (['On/Off', 'Dimmer'].includes(_switch.SwitchType)) {
      this.switchLoading = true;
      this.clickedIdx = _switch.idx;
      this.service.switchLight(_switch.idx, event).pipe(
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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
