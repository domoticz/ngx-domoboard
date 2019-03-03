import { NgModule } from '@angular/core';

import { SwitchesComponent } from './switches.component';
import { SwitchesRoutingModule } from './switches-routing.module';
import { StatusCardComponent } from './status-card/status-card.component';
import { NbCardModule } from '@nebular/theme';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    SwitchesRoutingModule,
    NbCardModule
  ],
  exports: [],
  declarations: [
    SwitchesComponent,
    StatusCardComponent
  ],
  providers: [],
})
export class SwitchesModule { }
