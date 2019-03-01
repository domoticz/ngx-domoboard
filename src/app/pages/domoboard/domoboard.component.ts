import { Component } from '@angular/core';

import { iif, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { LightSwitch } from '@nd/core/models';

import { DomoticzService } from 'src/app/core/services/domoticz.service';

@Component({
  selector: 'nd-domoboard',
  templateUrl: './domoboard.component.html'
})
export class DomoboardComponent {

  lightSwitches$ = this.domoticzService.select<LightSwitch[]>('lightSwitches').pipe(
    switchMap(stored => iif(() => !!stored[0], of(stored), this.domoticzService.getLightSwitches()))
  );

  constructor(private domoticzService: DomoticzService) { }

}
