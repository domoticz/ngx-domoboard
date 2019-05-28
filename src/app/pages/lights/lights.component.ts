import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subject, merge } from 'rxjs';
import { tap, takeUntil, take } from 'rxjs/operators';

import { Light } from '@nd/core/models';

import { LightsService } from '@nd/core/services';

@Component({
  selector: 'nd-lights',
  templateUrl: './lights.component.html',
  styleUrls: ['./lights.component.scss']
})
export class LightsComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject();

  lights$ = this.service.select<Light[]>('lights');

  icon = {
    Fireplace: 'nd-fireplace',
    Light: 'nb-lightbulb',
    Door: 'nd-door'
  };

  constructor(private service: LightsService) { }

  ngOnInit() {
    merge(
      this.service.getLights(),
      this.service.refreshLights()
    ).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe();
  }

  statusChanged(event: any, light: Light) {
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
