import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';

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
    Fireplace: `nd-fireplace`,
    Light: 'nb-lightbulb'
  };

  constructor(private service: LightsService) { }

  ngOnInit() {
    this.service.getLights().pipe(takeUntil(this.unsubscribe$)).subscribe();
    this.service.refreshLights().pipe(takeUntil(this.unsubscribe$)).subscribe();
  }

  statusChanged(event, light: Light) {
    this.service.switchLight(light.idx, event).pipe(
      tap(resp => { if (resp.status === 'OK') { light.Status = event; } })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
