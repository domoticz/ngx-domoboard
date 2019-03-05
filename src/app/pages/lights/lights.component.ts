import { Component } from '@angular/core';

import { iif, of } from 'rxjs';
import { switchMap, finalize, tap } from 'rxjs/operators';

import { Light } from '@nd/core/models';

import { DomoticzService } from 'src/app/core/services/domoticz.service';

@Component({
  selector: 'nd-lights',
  templateUrl: './lights.component.html',
  styleUrls: ['./lights.component.scss']
})
export class LightsComponent {

  lights$ = this.domoticzService.select<Light[]>('lights').pipe(
    switchMap(stored =>
      iif(() => !!stored && !!stored.length, of(stored), this.domoticzService.getLights()))
  );

  icon = {
    Fireplace: `nd-fireplace`,
    Light: 'nb-lightbulb'
  };

  constructor(private domoticzService: DomoticzService) { }

  statusChanged(event, light: Light) {
    this.domoticzService.switchLight(light.idx, event).pipe(
      tap(resp => { if (resp.status === 'OK') { light.Status = event; } })
    ).subscribe();
  }

}
