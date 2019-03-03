import { Component } from '@angular/core';

import { iif, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { LightSwitch } from '@nd/core/models';

import { DomoticzService } from 'src/app/core/services/domoticz.service';

@Component({
  selector: 'nd-switches',
  templateUrl: './switches.component.html'
})
export class SwitchesComponent {

  lightSwitches$ = this.domoticzService.select<LightSwitch[]>('lightSwitches').pipe(
    switchMap(stored => iif(() => !!stored[0], of(stored), this.domoticzService.getLightSwitches()))
  );

  constructor(private domoticzService: DomoticzService) { }

}
