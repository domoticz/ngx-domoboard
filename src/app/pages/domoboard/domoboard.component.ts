import { Component, OnInit } from '@angular/core';
import { DomoticzService } from 'src/app/core/services/domoticz.service';
import { Observable } from 'rxjs';
import { LightSwitch } from 'src/app/core/models/light-switch.interface';

@Component({
  selector: 'nd-domoboard',
  templateUrl: './domoboard.component.html'
})

export class DomoboardComponent implements OnInit {

  lightSwitches$: Observable<LightSwitch[]> = this.domoticzService.getLightSwitches();

  constructor(private domoticzService: DomoticzService) { }

  ngOnInit() {}

}
